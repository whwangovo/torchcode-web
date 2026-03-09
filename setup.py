from setuptools import setup, find_packages

# Only ship torch_judge for PyPI; rest of repo (labextension, templates, etc.) stays local.
setup(
    name="torch_judge",
    version="0.1.0",
    packages=find_packages(include=["torch_judge", "torch_judge.*"]),
    python_requires=">=3.10",
)
