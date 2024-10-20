import smartpy as sp

@sp.module
def main():
    class DonationPlatform(sp.Contract):
        def _init_(self):
            self.data.campaigns = sp.big_map()  # Store campaigns

        @sp.entry_point
        def start_campaign(self, params):
            # Use sp.cast to enforce parameter types
            campaign_name = sp.cast(params.campaign_name, sp.string)
            target_amount = sp.cast(params.target_amount, sp.mutez)
            campaign_id = sp.cast(params.campaign_id, sp.int)
            campaign_address = sp.cast(params.campaign_address, sp.address)
        
            self.data.campaigns[campaign_id] = sp.record(
                campaign_name=campaign_name,
                target_amount=target_amount,
                campaign_id=campaign_id,
                campaign_address=campaign_address,
                total_donations=sp.mutez(0),
                donors=sp.set()
            )

        @sp.entry_point
        def donate(self, params):
            # Accept sender and amount as parameters
            campaign_id = sp.cast(params.campaign_id, sp.int)
            sender = sp.cast(params.sender, sp.address)  # Sender parameter
            amount = sp.cast(params.amount, sp.mutez)  # Amount parameter
            campaign_address = sp.cast(params.campaign_address, sp.address)
            
            # Ensure the campaign exists and the donation amount is valid
            assert self.data.campaigns.contains(campaign_id), "Campaign does not exist"
            assert amount > sp.mutez(0), "Donation should be greater than zero"
            self.data.campaigns[campaign_id].donors.add(sender)
            
            # Update total donations
            assert self.data.campaigns[campaign_id].total_donations + amount <= self.data.campaigns[campaign_id].target_amount, "Donation exceeds target amount"
            self.data.campaigns[campaign_id].total_donations += amount
            
            sp.send(self.data.campaigns[campaign_id].campaign_address, amount)

@sp.add_test()
def test():
    admin = sp.test_account("Admin").address
    creator = sp.test_account("Creator").address
    donor = sp.test_account("Donor").address  # Using test accounts
    donor1 = sp.test_account("Donor1").address  # Another test account
    campaign_address = sp.test_account("Campaign Address").address
    s = sp.test_scenario("Donation Platform Test", main)

    # Initialize contract
    contract = main.DonationPlatform()
    s += contract

    # Start a campaign
    campaign_name = "Save the Earth"
    target_amount = sp.mutez(500000000)  # 500 tez target

    # Start campaign without .run()
    contract.start_campaign(sp.record(campaign_name=campaign_name, target_amount=target_amount, campaign_id=1, campaign_address=campaign_address))

    # Test valid donation
    # Call donate without using .run()
    try:
        contract.donate(sp.record(campaign_id=1, sender=donor, amount=sp.mutez(100), campaign_address=campaign_address))  # Valid donation
        print("Test Case 1 Passed: Valid donation.")
    except AssertionError as e:
        print("Test Case 1 Failed:", e)

    # Test invalid donation amount (exceeding target)
    try:
        contract.donate(sp.record(campaign_id=1, sender=donor1, amount=sp.mutez(100), campaign_address=campaign_address))  # Invalid amount
    except AssertionError as e:
        print("Test Case 2 Passed: Caught expected error for invalid donation:"), e