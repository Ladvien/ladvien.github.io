import os
import pandas as pd
from gspread_pandas import Spread, Client



print(os.getcwd())
project_md_path = f"{os.getcwd()}/_posts/2012-01-01-projects.md"

def get_df_from_gsheets(folder_name: str, workbook_name: str, worksheet_name: str) -> pd.DataFrame:
    client = Client()
    sheets = client.find_spreadsheet_files_in_folders(folder_name)
    sheet = Spread(workbook_name, worksheet_name)
    return sheet.sheet_to_df()

def get_header(lines: list) -> tuple:

    header_mark_count = 0
    header = []
    content = []
    
    for line in lines:
        if header_mark_count > 1:
            content.append(line)
        else:
            header.append(line)
            if "---" in line:
                header_mark_count += 1
    return (header, content)

with open(project_md_path, "r+") as f:
    header, content = get_header(f.readlines())
    df = get_df_from_gsheets("sheets", "tech_projects", "tech_projects")
    md = df.to_markdown()
    new_content = header + md.split("\n")
    new_content = [line if line.endswith("\n") else line + "\n" for line in new_content]
    new_content = "".join(new_content)
    f.seek(0)
    f.write(new_content)
    f.truncate()
