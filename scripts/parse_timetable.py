import pandas as pd
import os
import json
import glob

RAW_DATA_DIR = "../raw_data"
OUTPUT_FILE = "../new code/daystar-exam-hub-main/public/exam_data.json"

def parse_all_timetables():
    all_exams = []
    
    # Find all Excel files
    files = glob.glob(os.path.join(RAW_DATA_DIR, "*.xls")) + glob.glob(os.path.join(RAW_DATA_DIR, "*.xlsx"))
    
    if not files:
        print("No Excel files found in raw_data/")
        return

    print(f"Found {len(files)} files to process.")

    for file_path in files:
        print(f"Processing {file_path}...")
        try:
            # Read the entire sheet (assuming ATHIRIVER for now, can be expanded)
            # Using 'None' for sheet_name to read all sheets could be an option, 
            # but let's stick to 'ATHIRIVER' based on previous checks or iterate all.
            xl = pd.ExcelFile(file_path, engine='xlrd')
            
            for sheet_name in xl.sheet_names:
                print(f"  Scanning sheet: {sheet_name}")
                df = pd.read_excel(file_path, sheet_name=sheet_name, header=None, engine='xlrd')
                
                # 1. Identify Header Blocks
                header_indices = []
                days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]
                
                for idx, row in df.iterrows():
                    row_str = str(row.values).upper()
                    if any(day in row_str for day in days):
                        if idx + 1 < len(df):
                            next_row_str = str(df.iloc[idx+1].values).upper()
                            if "ROOM" in next_row_str or "AM" in next_row_str or "PM" in next_row_str:
                                header_indices.append(idx)
                
                # 2. Process each block
                for i, start_row in enumerate(header_indices):
                    end_row = header_indices[i+1] if i+1 < len(header_indices) else len(df)
                    
                    date_row = df.iloc[start_row]
                    time_row = df.iloc[start_row + 1]
                    
                    # Map Columns to Dates
                    col_dates = {}
                    current_date = "Unknown Date"
                    for col_idx in range(1, len(date_row)):
                        val = date_row[col_idx]
                        if pd.notna(val):
                            current_date = str(val).strip()
                        col_dates[col_idx] = current_date

                    # Scan Data Rows
                    for row_idx in range(start_row + 2, end_row):
                        row = df.iloc[row_idx]
                        venue = str(row[0]).strip()
                        if venue.lower() == "nan": continue

                        for col_idx in range(1, len(row)):
                            cell_value = str(row[col_idx]).strip()
                            
                            if cell_value.lower() == "nan" or "CHAPEL" in cell_value.upper():
                                continue
                            
                            # Handle multiple exams in one cell (e.g., "ACS 113, MIS 114")
                            # Assuming comma or slash separation
                            codes = [c.strip() for c in cell_value.replace('/', ',').split(',')]
                            
                            for code in codes:
                                if not code: continue
                                
                                exam_entry = {
                                    "courseCode": code,
                                    "venue": venue,
                                    "date": col_dates.get(col_idx, "Unknown Date"),
                                    "time": str(time_row[col_idx]).strip(),
                                    "campus": sheet_name,
                                    "sourceFile": os.path.basename(file_path)
                                }
                                all_exams.append(exam_entry)

        except Exception as e:
            print(f"Error processing {file_path}: {e}")

    # Save to JSON
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(all_exams, f, indent=2)
    
    print(f"\nSuccessfully saved {len(all_exams)} exams to {OUTPUT_FILE}")

if __name__ == "__main__":
    parse_all_timetables()
