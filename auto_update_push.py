import re
import subprocess

SCRIPT_FILE = "SlowDao.js"

def bump_version(version):
    parts = version.split('.')
    if len(parts) == 2:
        major, minor = parts
        minor = str(int(minor) + 1)
        return f"{major}.{minor}"
    elif len(parts) == 3:
        major, minor, patch = parts
        patch = str(int(patch) + 1)
        return f"{major}.{minor}.{patch}"
    else:
        return version

def update_version_in_file(filename):
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()
    match = re.search(r'@version\s+([0-9.]+)', content)
    if not match:
        print("未找到 @version 字段")
        return None
    old_version = match.group(1)
    new_version = bump_version(old_version)
    new_content = re.sub(r'(@version\s+)([0-9.]+)', r'\g<1>' + new_version, content, count=1)
    with open(filename, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"版本号已从 {old_version} 升级到 {new_version}")
    return new_version

def git_commit_and_push(filename, version):
    subprocess.run(["git", "add", filename])
    subprocess.run(["git", "commit", "-m", f"auto: 升级 SlowDao.js 到 v{version}"])
    subprocess.run(["git", "push"])

if __name__ == "__main__":
    version = update_version_in_file(SCRIPT_FILE)
    if version:
        git_commit_and_push(SCRIPT_FILE, version)


