#!/usr/bin/env python3
import os
import time
import mysql.connector
import logging
import sys
from urllib.parse import urlparse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def validate_env():
    """Validate that all required environment variables are set."""
    # First check for Railway format variables
    required_vars = [
        "MYSQLHOST",
        "MYSQLPORT",
        "MYSQLUSER",
        "MYSQLPASSWORD",
        "MYSQLDATABASE"
    ]
    
    # Log all environment variables (excluding passwords)
    logger.info("Environment variables:")
    for var in required_vars:
        if var != "MYSQLPASSWORD":
            logger.info("  %s: %s", var, os.getenv(var))
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if not missing_vars:
        logger.info("All Railway environment variables are set")
        return True
        
    # If Railway variables are not set, check for MYSQL_URL
    if os.getenv("MYSQL_URL"):
        logger.info("Using MYSQL_URL from environment")
        # Log the URL format (without password) for debugging
        url = os.getenv("MYSQL_URL")
        if url:
            parsed = urlparse(url)
            safe_url = f"mysql://{parsed.username}:***@{parsed.hostname}:{parsed.port or 3306}/{parsed.path.lstrip('/')}"
            logger.info("MYSQL_URL format: %s", safe_url)
        return True
    
    logger.error("Missing required environment variables: %s", ", ".join(missing_vars))
    return False

def get_connection_params():
    """Get database connection parameters from environment variables."""
    # First try Railway format variables
    if all(os.getenv(var) for var in ["MYSQLHOST", "MYSQLPORT", "MYSQLUSER", "MYSQLPASSWORD", "MYSQLDATABASE"]):
        logger.info("Using Railway format variables")
        return {
            "host": os.getenv("MYSQLHOST"),
            "port": int(os.getenv("MYSQLPORT", "3306")),
            "user": os.getenv("MYSQLUSER"),  # Use MYSQLUSER as is
            "password": os.getenv("MYSQLPASSWORD"),
            "database": os.getenv("MYSQLDATABASE")
        }
    
    # Fallback to MYSQL_URL
    if os.getenv("MYSQL_URL"):
        url = os.getenv("MYSQL_URL")
        if not url.startswith("mysql://"):
            raise ValueError("Invalid MYSQL_URL format. Must start with mysql://")
        
        parsed = urlparse(url)
        password = parsed.password if parsed.password else ""
        
        # Log parsed components (excluding password)
        logger.info("Parsed URL components:")
        logger.info("  Host: %s", parsed.hostname)
        logger.info("  Port: %s", parsed.port or 3306)
        logger.info("  User: %s", parsed.username)
        logger.info("  Database: %s", parsed.path.lstrip("/"))
        
        return {
            "host": parsed.hostname,
            "port": parsed.port or 3306,
            "user": parsed.username,  # Use username from URL
            "password": password,
            "database": parsed.path.lstrip("/")
        }
    
    raise ValueError("No valid database connection parameters found")

def try_connect(conn_params):
    """Try to connect to the database with the given parameters."""
    try:
        # Trying to connect via TCP
        logger.info("Attempting TCP connection at %s:%s as user %s", 
                   conn_params["host"], conn_params["port"], conn_params["user"])
        conn = mysql.connector.connect(
            **conn_params,
            connect_timeout=10,
            auth_plugin='mysql_native_password'
        )
        
        if conn.is_connected():
            logger.info("Successfully connected to database")
            conn.close()
            return True
            
    except Exception as e:
        logger.warning("Connection attempt failed: %s", str(e))
        return False

def check_db():
    """Check database connection with retry logic."""
    max_attempts = 5
    attempt = 0
    
    while attempt < max_attempts:
        try:
            # Get connection parameters
            conn_params = get_connection_params()
            
            # Try TCP connection
            if try_connect(conn_params):
                return True
            
            attempt += 1
            if attempt < max_attempts:
                logger.info("Waiting 2 seconds before next attempt...")
                time.sleep(2)
            else:
                logger.error("Failed to connect to database after %d attempts", max_attempts)
                return False
            
        except Exception as e:
            attempt += 1
            logger.warning("Database connection attempt %d failed: %s", attempt, str(e))
            if attempt < max_attempts:
                time.sleep(2)
            else:
                logger.error("Failed to connect to database after %d attempts", max_attempts)
                return False
    
    return False

if __name__ == "__main__":
    logger.info("Validating environment variables...")
    if not validate_env():
        sys.exit(1)
    
    logger.info("Checking database connection...")
    if not check_db():
        sys.exit(1)
    
    logger.info("Database connection successful") 