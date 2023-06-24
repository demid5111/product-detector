configure_script() {
  source venv/bin/activate
  export PYTHONPATH=$(pwd):$PYTHONPATH
}
