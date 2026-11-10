export class Helper {
  /**
   * Removes all non-numeric characters (except the decimal point) from a price string
   * and returns the numeric value.
   */
  static convertPriceToNumber(price: string): number {
    const cleaned = price.replace(/[^0-9.]/g, "");
    return parseFloat(cleaned);
  }

  /**
   * Returns fixed product details used in tests.
   */
  static getProductDetails() {
    return {
      productName: "MacBook",
      productQuantity: "1",
      totalPrice: "$602.00",
    };
  }

  /**
   * Returns fixed login credentials used in tests.
   */
  static getLoginDetails() {
    return {
      email: "pavanol@xyz.com",
      password: "test@123",
    };
  }
}

