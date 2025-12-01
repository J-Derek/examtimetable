import pandas as pd
import os

file_path = "DRAFT_EXAMINATION TIMETABLE -SEPTEMBER 2025.xls"

def debug_dates():
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return

    try:
        df = pd.read_excel(file_path, sheet_name='ATHIRIVER', header=None, engine='xlrd')
        
        # Find ROOM row
        room_row_idx = -1
        for idx, row in df.iterrows():
            first_col = str(row[0]).upper()
            if "ROOM" in first_col:
                room_row_idx = idx
                break
        
        if room_row_idx == -1:
            print("No ROOM row found")
            return

        date_row = df.iloc[room_row_idx - 1]
        
        print(f"--- Date Row (Index {room_row_idx - 1}) ---")
        current_date = None
        for col_idx in range(1, len(date_row)):
            val = date_row[col_idx]
            if pd.notna(val):
                current_date = str(val).strip()
                print(f"Col {col_idx}: {current_date} (New Header)")
            else:
                # This column inherits the previous date
                pass
                # print(f"Col {col_idx}: {current_date} (Inherited)")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_dates()
