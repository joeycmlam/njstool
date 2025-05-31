import requests
from requests.auth import HTTPBasicAuth
import json
import os
from typing import List, Dict, Any

class JiraConfig:
    def __init__(self, config_path: str):
        self.config = self._load_config(config_path)

    def _load_config(self, path: str) -> Dict[str, Any]:
        with open(path, "r") as f:
            return json.load(f)

    @property
    def domain(self) -> str:
        return self.config["JIRA_DOMAIN"]

    @property
    def email(self) -> str:
        return self.config["EMAIL"]

    @property
    def api_token(self) -> str:
        return self.config["API_TOKEN"]

    @property
    def project_key(self) -> str:
        return self.config["PROJECT_KEY"]

    @property
    def fix_version(self) -> str:
        return self.config["FIX_VERSION"]

class JiraClient:
    def __init__(self, config: JiraConfig):
        self.config = config
        self.base_url = f"https://{self.config.domain}/rest/api/3"

    def get_issues_by_fix_version(self) -> List[Dict[str, Any]]:
        # Only extract issues for the configured project key and fixVersion
        jql = (
            f'project = "{self.config.project_key}" '
            f'AND fixVersion = "{self.config.fix_version}" ORDER BY key ASC'
        )
        url = f"{self.base_url}/search"
        headers = {"Accept": "application/json"}
        auth = HTTPBasicAuth(self.config.email, self.config.api_token)
        params = {
            "jql": jql,
            "fields": "key,summary,fixVersions"
        }
        response = requests.get(url, headers=headers, params=params, auth=auth)
        response.raise_for_status()
        issues = response.json().get("issues", [])
        # Filter issues to ensure only those from the specified project are included
        filtered_issues = [
            {
                "key": issue["key"],
                "summary": issue["fields"]["summary"],
                "fixVersions": [fv["name"] for fv in issue["fields"].get("fixVersions", [])]
            }
            for issue in issues
            if issue["key"].startswith(self.config.project_key + "-")
        ]
        return filtered_issues


class JiraIssuePrinter:
    @staticmethod
    def print_issues(issues: List[Dict[str, Any]]) -> None:
        for issue in issues:
            fix_versions = ", ".join(issue["fixVersions"])
            print(f"{issue['key']}: {issue['summary']} (FixVersions: {fix_versions})")

def main():
    config_path = os.path.join(os.path.dirname(__file__), "config.json")
    config = JiraConfig(config_path)
    client = JiraClient(config)
    issues = client.get_issues_by_fix_version()
    JiraIssuePrinter.print_issues(issues)

if __name__ == "__main__":
    main()