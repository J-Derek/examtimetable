import pandas as pd
import os

file_path = "DRAFT_EXAMINATION TIMETABLE -SEPTEMBER 2025.xls"
target_exam = "ECO111B"

def find_exam():
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return

    try:
        # Load the sheet (assuming ATHIRIVER for now, but logic applies to all)
        # We'll check all sheets just in case
        xl = pd.ExcelFile(file_path, engine='xlrd')
        
        for sheet_name in xl.sheet_names:
            print(f"Scanning sheet: {sheet_name}...")
            df = pd.read_excel(file_path, sheet_name=sheet_name, header=None, engine='xlrd')
            
            # 1. Find the "ROOM" row
            room_row_idx = -1
            for idx, row in df.iterrows():
                first_col = str(row[0]).upper()
                if "ROOM" in first_col:
                    room_row_idx = idx
                    break
            
            if room_row_idx == -1:
                print(f"  No 'ROOM' row found in {sheet_name}")
                continue

            # 2. Extract Headers
            # Date Row is usually i-1
            date_row = df.iloc[room_row_idx - 1]
            # Time Row is i
            time_row = df.iloc[room_row_idx]
            
            # Propagate Dates (forward fill logic)
            current_date = None
            col_dates = {} # Map col_idx -> Date String
            
            for col_idx in range(1, len(date_row)):
                val = date_row[col_idx]
                if pd.notna(val):
                    current_date = str(val).strip()
                
                if current_date:
                    col_dates[col_idx] = current_date

            # 3. Scan Data Rows
            # Start from room_row_idx + 1
            for row_idx in range(room_row_idx + 1, len(df)):
                row = df.iloc[row_idx]
                venue = str(row[0]).strip()
                
                # Check each cell in the row
                for col_idx in range(1, len(row)):
                    cell_value = str(row[col_idx]).strip().upper()
                    
                    # Check if target exam is in this cell
                    # (Using 'in' because cell might contain multiple exams like "ECO111B, ECO112A")
                    if target_exam in cell_value:
                        exam_date = col_dates.get(col_idx, "Unknown Date")
                        exam_time = str(time_row[col_idx]).strip()
                        
                        print("\n" + "="*30)
                        print(f"FOUND {target_exam}!")
                        print("="*30)
                        print(f"Sheet: {sheet_name}")
                        print(f"Venue: {venue}")
                        print(f"Date : {exam_date}")
                        print(f"Time : {exam_time}")
                        print(f"Exact Cell Content: {cell_value}")
                        # return  <-- Removed to find ALL matches

        print(f"\nExam {target_exam} not found in any sheet.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_exam()
