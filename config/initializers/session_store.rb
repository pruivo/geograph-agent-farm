# Configure the TorqueBox Servlet-based session store.
# Provides for server-based, in-memory, cluster-compatible sessions
GeographGenerator::Application.config.session_store :torquebox_store if defined?(ActionDispatch::Session::TorqueboxStore)