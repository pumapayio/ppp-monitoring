# Event  Monitoring 

// Method used to handle create or edit Billing Model (BM) events
// We first construct the bm details
// When constructing the BM details, we take the following actions:
// 1. Retrieve the billing model details from the blockchain
// 2. Serialize them
// 3. Check in our DB if the record exists or not
// 4. Based on the above, attach to the returned object the ID from our db
//    By doing so, we allow typeORM to either create or update
// The above process is followed on all CREATION events:
// - Billing Model
// - BM Subscription
// - Pull Payment
// In addition to the above, when it comes to BM Subscription, we also
// check if the parent BM exist in our DB - if it does, then all good,
// otherwise, we retrieve the data from the blockchain and we store it
// in our DB.
// We follow the above for the pull payments as well, i.e. if the
// parent BM subscription doesn't exists in our DB, we retrieve it
// and store it.
// The above makes sure that even if a 'parent' event was missed during
// monitoring, we will retrieve it when we get the 'child' event
