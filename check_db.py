#!/usr/bin/env python3
import os
import time
import mysql.connector
import logging
import sys
from urllib.parse import urlparse, unquote

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def validate_env():
    """Validate that all required environment variables are set."""
    # Check for MYSQL_URL first
    if os.getenv("MYSQL_URL"):
        logger.info("Using MYSQL_URL from environment")
        # Log the URL format (without password) for debugging
        url = os.getenv("MYSQL_URL")
        if url:
            parsed = urlparse(url)
            safe_url = f"mysql://{parsed.username}:***@{parsed.hostname}:{parsed.port or 3306}/{parsed.path.lstrip('/')}"
            logger.info("MYSQL_URL format: %s", safe_url)
        return True
        
    # Check for Railway format variables
    required_vars = [
        "MYSQLHOST",
        "MYSQLPORT",
        "MYSQLUSER",
        "MYSQLPASSWORD",
        "MYSQLDATABASE"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        logger.error("Missing required environment variables: %s", ", ".join(missing_vars))
        return False
    
    logger.info("All required environment variables are set")
    return True

def parse_mysql_url(url):
    """Parse MySQL URL and return connection parameters."""
    if not url.startswith("mysql://"):
        raise ValueError("Invalid MYSQL_URL format. Must start with mysql://")
    
    parsed = urlparse(url)
    
    # URL decode the password to handle special characters
    password = unquote(parsed.password) if parsed.password else ""
    
    # Log parsed components (excluding password)
    logger.info("Parsed URL components:")
    logger.info("  Host: %s", parsed.hostname)
    logger.info("  Port: %s", parsed.port or 3306)
    logger.info("  User: %s", parsed.username)
    logger.info("  Database: %s", parsed.path.lstrip("/"))
    
    return {
        "host": parsed.hostname,
        "port": parsed.port or 3306,
        "user": parsed.username,  # Use the username from the URL
        "password": password,
        "database": parsed.path.lstrip("/")
    }

def try_connect(conn_params, use_socket=False):
    """Try to connect to the database with the given parameters."""
    try:
        if use_socket:
            # Try connecting via socket
            logger.info("Attempting socket connection at /var/run/mysqld/mysqld.sock")
            conn = mysql.connector.connect(
                unix_socket="/var/run/mysqld/mysqld.sock",
                user=conn_params["user"],
                password=conn_params["password"],
                database=conn_params["database"],
                connect_timeout=10,
                auth_plugin='mysql_native_password'
            )
        else:
            # Try connecting via TCP
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
    max_attempts = 5  # Reduced to 5 retries
    attempt = 0
    
    while attempt < max_attempts:
        try:
            # Get connection details
            if os.getenv("MYSQL_URL"):
                # Parse MYSQL_URL
                url = os.getenv("MYSQL_URL")
                try:
                    conn_params = parse_mysql_url(url)
                    logger.info("Successfully parsed MYSQL_URL")
                except ValueError as e:
                    logger.error("Failed to parse MYSQL_URL: %s", str(e))
                    return False
            else:
                # Use Railway format variables
                conn_params = {
                    "host": os.getenv("MYSQLHOST"),
                    "port": int(os.getenv("MYSQLPORT", "3306")),
                    "user": os.getenv("MYSQLUSER"),  # Use MYSQLUSER instead of forcing root
                    "password": os.getenv("MYSQLPASSWORD"),
                    "database": os.getenv("MYSQLDATABASE")
                }
                logger.info("Using Railway format variables")
            
            # Try socket connection first
            if try_connect(conn_params, use_socket=True):
                return True
                
            # If socket fails, try TCP connection
            if try_connect(conn_params, use_socket=False):
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