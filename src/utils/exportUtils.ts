import * as XLSX from 'xlsx';

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToExcel = (sheets: { sheetName: string; data: any[] }[], filename: string) => {
  const wb = XLSX.utils.book_new();
  sheets.forEach(({ sheetName, data }) => {
    if (data && data.length > 0) {
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
    }
  });
  XLSX.writeFile(wb, `${filename}.xlsx`);
};
