/**
* Sell land from one citizen to another
* @param {org.county.government.Sale} sale - the LandSale transaction
* @transaction
*/

async function sale(contract){
  // Get info from contract
  const buyer = contract.SaleContract.Buyer;
  const seller = contract.SaleContract.Seller;
  const price  = contract.SaleContract.Price;
  const land = contract.SaleContract.Land;
  
  // Check if buyer has sufficient funds
  if(buyer.walletBalance < price){
    throw new Error('Buyer does not have sufficient funds to complete the sale.');
  }
  
  // Update balance
  seller.walletBalance += price;
  buyer.walletBalance  -= price;
  
  // Update ownership
  land.Owner = buyer;
  
  // Update property in registry
  const propertyRegistry = await getAssetRegistry('org.county.government.Land');
  await propertyRegistry.update(land);
  
  // Update seller in registry
  const sellerRegistry = await getParticipantRegistry('org.county.government.Citizen');
  await sellerRegistry.update(seller);
    
  // Update buyer in registry
  const buyerRegistry = await getParticipantRegistry('org.county.government.Citizen');
  await buyerRegistry.update(buyer);
}