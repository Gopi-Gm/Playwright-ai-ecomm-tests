import fs from "fs";
import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";

export class DataProvider {
  /**
   * Reads and parses a JSON file, returning the parsed data.
   */
  static readJson(filePath: string) {
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  }

  /**
   * Reads and parses a CSV file using csv-parse/sync.
   */
  static readCsv(filePath: string) {
    const content = fs.readFileSync(filePath);
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
    });
  }

  /**
   * Reads an Excel file and returns the first sheet as JSON (array of arrays).
   */
  static readExcel(filePath: string) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  }
}

