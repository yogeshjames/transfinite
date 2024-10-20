import smartpy as sp

@sp.module
def main():
    class DonationPlatform(sp.Contract):
        def init(self):
            self.data.campaigns = sp.big_map()
            self.data.badges = sp.big_map(tkey=sp.address, tvalue=sp.int)  # Gamification: Track badges for donors
            self.data.recurring_donations = sp.big_map()  # Recurring donations mapping
            
        @sp.entry_point
        def start_campaign(self, params):
            campaign_name = sp.cast(params.campaign_name, sp.string)
            target_amount = sp.cast(params.target_amount, sp.mutez)
            campaign_id = sp.cast(params.campaign_id, sp.int)
            campaign_address = sp.cast(params.campaign_address, sp.address)
            end_date = sp.cast(params.end_date, sp.timestamp)

            self.data.campaigns[campaign_id] = sp.record(
                campaign_name=campaign_name,
                target_amount=target_amount,
                campaign_id=campaign_id,
                campaign_address=campaign_address,
                total_donations=sp.mutez(0),
                donors=sp.set(),
                end_date=end_date,
                transparency_score=sp.int(0),  # Transparency score for campaigns
                takeover_status=False,  # Campaign takeover feature
                linked_campaigns=sp.set(),  # Multi-campaign integration
                events=sp.list([])  # Event-based crowdfunding
            )

        @sp.entry_point
        def donate(self, params):
            campaign_id = sp.cast(params.campaign_id, sp.int)
            sender = sp.cast(params.sender, sp.address)
            amount = sp.cast(params.amount, sp.mutez)

            assert self.data.campaigns.contains(campaign_id), "Campaign does not exist"
            assert amount > sp.mutez(0), "Donation should be greater than zero"
            assert sp.now <= self.data.campaigns[campaign_id].end_date, "Campaign has ended"
            
            self.data.campaigns[campaign_id].donors.add(sender)
            self.data.campaigns[campaign_id].total_donations += amount
            
            # Automatic Refund if goal is not met after deadline
            if sp.now > self.data.campaigns[campaign_id].end_date:
                if self.data.campaigns[campaign_id].total_donations < self.data.campaigns[campaign_id].target_amount:
                    sp.send(sender, amount)  # Refund donation
                else:
                    # Add badge for donation
                    self.add_badge(sender)

        @sp.entry_point
        def add_badge(self, donor):
            # Gamification: Reward donors with badges
            if not self.data.badges.contains(donor):
                self.data.badges[donor] = 1
            else:
                self.data.badges[donor] += 1

        @sp.entry_point
        def set_recurring_donation(self, params):
            campaign_id = sp.cast(params.campaign_id, sp.int)
            donor = sp.cast(params.donor, sp.address)
            amount = sp.cast(params.amount, sp.mutez)
            frequency = sp.cast(params.frequency, sp.int)  # Frequency in days
            
            self.data.recurring_donations[(donor, campaign_id)] = sp.record(
                amount=amount,
                next_donation=sp.now.add_days(frequency)
            )
        
        @sp.entry_point
        def process_recurring_donations(self):
            for (donor, campaign_id) in self.data.recurring_donations.keys():
                donation_info = self.data.recurring_donations[(donor, campaign_id)]
                if sp.now >= donation_info.next_donation:
                    self.donate(sp.record(
                        campaign_id=campaign_id,
                        sender=donor,
                        amount=donation_info.amount
                    ))
                    # Update next donation date
                    self.data.recurring_donations[(donor, campaign_id)].next_donation = sp.now.add_days(30)  # Monthly

        @sp.entry_point
        def takeover_campaign(self, params):
            campaign_id = sp.cast(params.campaign_id, sp.int)
            new_figure = sp.cast(params.new_figure, sp.address)

            assert self.data.campaigns.contains(campaign_id), "Campaign does not exist"
            assert not self.data.campaigns[campaign_id].takeover_status, "Campaign already taken over"

            self.data.campaigns[campaign_id].takeover_status = True
            self.data.campaigns[campaign_id].campaign_address = new_figure  # Change campaign ownership temporarily

        @sp.entry_point
        def link_campaigns(self, params):
            campaign_id = sp.cast(params.campaign_id, sp.int)
            linked_campaign_id = sp.cast(params.linked_campaign_id, sp.int)

            assert self.data.campaigns.contains(campaign_id), "Campaign does not exist"
            assert self.data.campaigns.contains(linked_campaign_id), "Linked campaign does not exist"

            self.data.campaigns[campaign_id].linked_campaigns.add(linked_campaign_id)

        @sp.entry_point
        def add_event(self, params):
            campaign_id = sp.cast(params.campaign_id, sp.int)
            event_name = sp.cast(params.event_name, sp.string)

            assert self.data.campaigns.contains(campaign_id), "Campaign does not exist"
            
            self.data.campaigns[campaign_id].events.push(event_name)

        @sp.entry_point
        def rate_transparency(self, params):
            campaign_id = sp.cast(params.campaign_id, sp.int)
            rating = sp.cast(params.rating, sp.int)

            assert self.data.campaigns.contains(campaign_id), "Campaign does not exist"
            assert 0 <= rating <= 10, "Invalid rating"  # Ensure rating is between 0 and 10

            # Update transparency score
            self.data.campaigns[campaign_id].transparency_score = (self.data.campaigns[campaign_id].transparency_score + rating) // 2

@sp.add_test(name="Donation Platform Test")
def test():
    admin = sp.test_account("Admin").address
    creator = sp.test_account("Creator").address
    donor = sp.test_account("Donor").address
    donor1 = sp.test_account("Donor1").address
    campaign_address = sp.test_account("Campaign Address").address
    s = sp.test_scenario("Donation Platform Test", main)

    contract = main.DonationPlatform()
    s += contract

    campaign_name = "Save the Earth"
    target_amount = sp.mutez(500000000)
    end_date = sp.timestamp_from_now(30*24*60*60)  # 30 days from now

    contract.start_campaign(sp.record(campaign_name=campaign_name, target_amount=target_amount, campaign_id=1, campaign_address=campaign_address, end_date=end_date))

    contract.donate(sp.record(campaign_id=1, sender=donor, amount=sp.mutez(100000), campaign_address=campaign_address))

    # Recurring donation setup
    contract.set_recurring_donation(sp.record(campaign_id=1, donor=donor, amount=sp.mutez(5000), frequency=30))
    contract.process_recurring_donations()

    # Campaign takeover
    contract.takeover_campaign(sp.record(campaign_id=1, new_figure=admin))

    # Add event-based crowdfunding
    contract.add_event(sp.record(campaign_id=1, event_name="Product Launch"))

    # Rate transparency
    contract.rate_transparency(sp.record(campaign_id=1, rating=8))

    # Add linked campaign
    contract.link_campaigns(sp.record(campaign_id=1, linked_campaign_id=2))
