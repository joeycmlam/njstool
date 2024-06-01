def save_url_to_file(url, filename="url.txt"):
    with open(filename, 'w') as file:
        file.write(url)

# Call this function in your main block
save_url_to_file(URL)