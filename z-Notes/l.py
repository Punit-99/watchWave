import os

def rename_files(directory):
    files = os.listdir(directory)
    image_number = 1

    for filename in files:
        if os.path.isfile(os.path.join(directory, filename)):
            new_name = f"image_{image_number:02d}{os.path.splitext(filename)[1]}"
            os.rename(os.path.join(directory, filename), os.path.join(directory, new_name))
            image_number += 1

if __name__ == "__main__":
    user_directory = input("Enter the directory path: ")
    rename_files(user_directory)