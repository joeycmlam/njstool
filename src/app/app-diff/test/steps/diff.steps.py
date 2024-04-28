from behave import given, when, then
from diff import FileComparator
import pandas as pd
import json

@given('I have two files "{file1}" and "{file2}" with config "{config}"')
def step_given(context, file1, file2, config):
    context.file1 = file1
    context.file2 = file2
    with open(config, 'r') as f:
        context.config = json.load(f)

@when('I compare the files using FileComparator')
def step_when(context):
    context.config['files'] = [context.file1, context.file2]
    comparator = FileComparator(context.config)
    comparator.compare()
    context.output_file = context.config['out']['filename']

@then('the total number of matching rows should be {matches:d}')
def step_then_matches(context, matches):
    df = pd.read_excel(context.output_file, sheet_name='Summary')
    assert df['Number of Matches'].sum() == matches

@then('the total number of mismatching rows should be {mismatches:d}')
def step_then_mismatches(context, mismatches):
    df = pd.read_excel(context.output_file, sheet_name='Summary')
    assert df['Number of Mismatches'].sum() == mismatches