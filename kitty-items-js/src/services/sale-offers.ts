import { SaleOffer } from "../models/sale-offer";

class SaleOffersService {
  async findMostRecentSales() {
    return SaleOffer.query().orderBy("created_at", "desc").limit(20);
  }
}
