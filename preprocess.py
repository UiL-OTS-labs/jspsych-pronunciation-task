import csv
import base64
import sys
import os
from pathlib import Path


def process_responses(name, file_in, file_out):
    counter = 1
    reader = csv.DictReader(file_in)
    writer = csv.DictWriter(file_out, reader.fieldnames)
    Path('audio').mkdir(exist_ok=True)

    for row in reader:
        if row.get('trial_type') == 'html-audio-response':
            audio_data = base64.b64decode(row['response'])
            ext = 'wav'  # default fallback
            if audio_data.startswith(b'Ogg'):
                ext = 'ogg'
            elif b'webm' in audio_data[:100]:
                ext = 'webm'

            audio_name = f'audio/{name}_{counter:04}.{ext}'
            with open(audio_name, 'wb') as audio_file:
                audio_file.write(audio_data)
            row['response'] = audio_name
            counter += 1
        writer.writerow(row)


def main(args):
    """assumes a list of input files as arguments"""
    out_dir = Path('processed')
    out_dir.mkdir(exist_ok=True)
    csv.field_size_limit(sys.maxsize)

    for arg in args:
        filename = arg
        name = os.path.splitext(filename)[0]
        output = out_dir / (name + '.processed.csv')

        with open(filename, 'r') as file_in:
            with open(output, 'w') as file_out:
                process_responses(name, file_in, file_out)


if __name__ == '__main__':
    if len(sys.argv) > 1:
        main(sys.argv[1:])
    else:
        print('Usage: preprocess.py csv_file [csv_file2] ...\n\n'
              'Please pass one or more input files as arguments')
