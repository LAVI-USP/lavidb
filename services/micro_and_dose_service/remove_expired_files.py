from datetime import datetime
import pathlib
import os

datasets = pathlib.Path("/files/thumbs")
files = list(datasets.rglob("*.tar.gz"))
for file in files:
  file_mod_time = datetime.fromtimestamp(os.path.getmtime(file))
  today = datetime.today()
  age = today - file_mod_time
  print(f"{file} -> age  {age.days} days")
  if age.days > 7:
    print("File older than 7 days")
    print("removing...")
    os.remove(file)
  