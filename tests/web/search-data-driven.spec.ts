import { test, expect } from "../../fixtures/pageFixtures";
import { DataProvider } from "../../utils/DataReader";
import path from "path";

/**
 * Data-Driven Search Tests — using CSV file
 *
 * Tags: @web @datadriven @regression
 */

const searchData = DataProvider.readCsv(
  path.join(__dirname, "../../testdata/shoplab_search_data.csv")
) as Array<{
  searchTerm: string;
  expectedResultCount: string;
  expectedProductName: string;
}>;

test.describe("Search — Data-Driven Tests", () => {
  for (const row of searchData) {
    test(`search for "${row.searchTerm}" should return ${row.expectedResultCount} results @web @datadriven @regression`, async ({
      productsPage,
    }) => {
      await productsPage.goto();
      await productsPage.search(row.searchTerm);
      const mainText = await productsPage.getMainText();

      const count = parseInt(row.expectedResultCount);
      if (count === 0) {
        expect(mainText).toContain("0 results for");
        expect(mainText).toContain("No products found");
      } else {
        expect(mainText).toContain(`${count} result`);
        if (row.expectedProductName) {
          expect(mainText).toContain(row.expectedProductName);
        }
      }
    });
  }
});

