import os
import pandas as pd
from gspread_pandas import Spread, Client

project_md_path = f"{os.getcwd()}/_posts/2012/2012-01-01-projects.md"


def get_df_from_gsheets(
    folder_name: str, workbook_name: str, worksheet_name: str, cols_to_preserve=[]
) -> pd.DataFrame:
    client = Client()
    print("here")
    sheets = client.find_spreadsheet_files_in_folders(folder_name)
    sheet = Spread(workbook_name, worksheet_name)
    return sheet.sheet_to_df(formula_columns=cols_to_preserve)


def get_col_names_from_sheet(workbook: Spread) -> list:
    return workbook.sheet.row_values(1)


def get_header(lines: list) -> tuple:
    text = "".join(lines).split("# Projects\n")
    return text[0].split("\n"), text[1].split("\n")


with open(project_md_path, "r+") as f:
    # Get article and project list.
    article, project_list = get_header(f.readlines())
    df = get_df_from_gsheets(
        "sheets", "tech_projects", "tech_projects", cols_to_preserve=[]
    )
    md = df.to_markdown()
    # Recompile the article with project list. article[:-1] removes an extra '\n'.
    new_content = article[:-1] + ["# Projects\n\n"] + md.split("\n")
    new_content = [line if line.endswith("\n") else line + "\n" for line in new_content]
    new_content = "".join(new_content)
    f.seek(0)
    f.write(new_content)
    f.truncate()
