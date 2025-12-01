import pandas as pd
import os

file_path = "DRAFT_EXAMINATION TIMETABLE -SEPTEMBER 2025.xls"
target_exams = ["MAT120A", "PHL111A"]

def find_exams_multi_section():
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return

    try:
        # Read the entire sheet
        df = pd.read_excel(file_path, sheet_name='ATHIRIVER', header=None, engine='xlrd')
        
        # 1. Identify Header Blocks
        # A header block is a row with "MONDAY" etc, followed by a row with "ROOM" or times
        header_indices = []
        days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]
        
        for idx, row in df.iterrows():
            row_str = str(row.values).upper()
            # Check if row contains a day name
            if any(day in row_str for day in days):
                # Check if next row exists and has "ROOM" or times
                if idx + 1 < len(df):
                    next_row_str = str(df.iloc[idx+1].values).upper()
                    if "ROOM" in next_row_str or "AM" in next_row_str or "PM" in next_row_str:
                        header_indices.append(idx)

        print(f"Found Header Blocks at rows: {header_indices}")

        # 2. Process each block
        for i, start_row in enumerate(header_indices):
            # Determine end row for this block (either next header or end of df)
            end_row = header_indices[i+1] if i+1 < len(header_indices) else len(df)
            
            print(f"\nScanning Block {i+1} (Rows {start_row} to {end_row})...")
            
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

            # Scan Data Rows in this block
            for row_idx in range(start_row + 2, end_row):
                row = df.iloc[row_idx]
                venue = str(row[0]).strip()
                
                for col_idx in range(1, len(row)):
                    cell_value = str(row[col_idx]).strip().upper()
                    
                    for target in target_exams:
                        if target in cell_value:
                            exam_date = col_dates.get(col_idx, "Unknown Date")
                            exam_time = str(time_row[col_idx]).strip()
                            
                            print("-" * 30)
                            print(f"FOUND {target}!")
                            print(f"Venue: {venue}")
                            print(f"Date : {exam_date}")
                            print(f"Time : {exam_time}")
                            print(f"Cell : {cell_value}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_exams_multi_section()
