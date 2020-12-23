import os
from glob import glob

root_path = os.environ["HOME"]

############
# Parameters
############
raw_images_dir = f"{root_path}/ladvien.github.io/raw_images"
mp4_dir = f"{root_path}/ladvien.github.io/images/movies/"

if not os.path.exists(mp4_dir):
    print(f"Making directory {mp4_dir}")
    os.makedirs(mp4_dir)

gif_paths = (
    glob(f"{raw_images_dir}/**/*.gif", recursive=True)
)

############
# Convert
############
for gif_path in gif_paths:
    filename = gif_path.split("/")[-1]
    output_file_path = f"""{mp4_dir}{filename.replace(".gif", "")}.mp4"""
    if not os.path.exists(output_file_path):
        cmd = f"""ffmpeg -i {gif_path} -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" {output_file_path}"""
        print(f"Converting {filename} to MP4.")
        os.system(cmd)
    else:
        print(f"{output_file_path} already exists.")