import pandas as pd
import os

file_path = "DRAFT_EXAMINATION TIMETABLE -SEPTEMBER 2025.xls"

if not os.path.exists(file_path):
    print(f"Error: File not found at {file_path}")
    exit(1)

try:
    # Read the excel file
    # header=None because the first few rows might be titles/metadata
    df = pd.read_excel(file_path, sheet_name='ATHIRIVER', header=None, engine='xlrd')
    
    print("--- Finding Anchor Row ---")
    # Find the row index where the first column contains "ROOM" (case insensitive)
    room_row_idx = -1
    for idx, row in df.iterrows():
        first_col = str(row[0]).upper()
        if "ROOM" in first_col:
            room_row_idx = idx
            break
    
    if room_row_idx != -1:
        print(f"Found 'ROOM' at row index: {room_row_idx}")
        print("--- Header Rows (Date/Time) ---")
        # Print the 2 rows above ROOM and the ROOM row itself
        print(df.iloc[room_row_idx-2:room_row_idx+1].to_string())
        print("\n--- First Data Rows ---")
        print(df.iloc[room_row_idx+1:room_row_idx+6].to_string())
    else:
        print("Could not find 'ROOM' in the first column.")
        print(df.head(15).to_string())

    print("\n--- Sheet Names ---")
    xl = pd.ExcelFile(file_path, engine='xlrd')
    print(xl.sheet_names)

except Exception as e:
    print(f"Error reading excel: {e}")
