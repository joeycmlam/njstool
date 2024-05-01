from behave import given, when, then
from FileComparator2 import FileComparator
import logging

@given('I have two files "{file}" with key "{key}"')
def step_given_file_with_key(context, file, key):
    context.file = file
    context.key = key

@when('I compare the files using FileComparator')
def step_when_compare_files(context):
    config = {
        "log": {
            "level": "info",
            "path": "logs",
            "filename": "app.log"
        },
        "out": {
            "path": "/Users/joeylam/repo/njs/njstool/src/app/app-diff/output",
            "filename": "results.xlsx"
        },
        "path1": "/Users/joeylam/repo/njs/njstool/src/app/app-diff/test/data/data-1",
        "path2": "/Users/joeylam/repo/njs/njstool/src/app/app-diff/test/data/data-2",
        'files': [
            {'filename': context.file, 'key': context.key},
            {'filename': context.file, 'key': context.key}
        ],
        "rounding_threshold": 0.001
    }
    logger = logging.getLogger(__name__)
    comparator = FileComparator(config, logger)
    context.result = comparator.compare_files()

@then('I expect the files result')
def step_then_files_match(context):
    assert context.result == [], "Files do not match"
