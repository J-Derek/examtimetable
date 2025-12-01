import pandas as pd
import os

file_path = "DRAFT_EXAMINATION TIMETABLE -SEPTEMBER 2025.xls"

def scan_all_dates():
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return

    try:
        # Read the entire sheet
        df = pd.read_excel(file_path, sheet_name='ATHIRIVER', header=None, engine='xlrd')
        
        print(f"Scanning {len(df)} rows for dates...")
        
        days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]
        
        found_header_rows = []

        for idx, row in df.iterrows():
            # Check if any cell in this row contains a day name
            row_str = str(row.values).upper()
            
            found_day = False
            for day in days:
                if day in row_str:
                    found_day = True
                    break
            
            if found_day:
                print(f"\n[Row {idx}] Potential Header Found:")
                # Print non-null values in this row
                for col_idx, val in enumerate(row):
                    if pd.notna(val):
                        print(f"  Col {col_idx}: {val}")
                found_header_rows.append(idx)

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    scan_all_dates()
