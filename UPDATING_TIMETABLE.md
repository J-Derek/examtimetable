# Updating the Timetable

This guide explains how to update the exam timetable when a new Excel file is released.

## Prerequisites

- **Python**: Ensure Python is installed on your system.
- **Dependencies**: You may need to install `pandas` and `xlrd` if not already installed:
  ```bash
  pip install pandas xlrd
  ```

## Steps

1.  **Prepare the Excel File**:
    - Obtain the new timetable Excel file (`.xls` or `.xlsx`).
    - Place the file in the `raw_data` folder located in the root of the project.
    - **Note**: You can remove old files from `raw_data` to avoid confusion, or keep them as backups. The script processes *all* Excel files found in that folder.

2.  **Run the Update Script**:
    - Open a terminal/command prompt.
    - Navigate to the `scripts` folder:
      ```bash
      cd scripts
      ```
    - Run the parser script:
      ```bash
      python parse_timetable.py
      ```

3.  **Verify the Update**:
    - The script will generate a new `exam_data.json` file in the frontend's public folder.
    - Check the terminal output for a success message.
    - **Refresh the web page** to see the new data (no need to restart any servers!).

## Troubleshooting

- **"No Excel files found"**: Ensure your file is inside the `raw_data` folder.
- **"Error processing file"**: Check if the Excel file format has changed significantly.
