/**
 * Status Command - Check system health and status
 */

const chalk = require('chalk');
const ora = require('ora');
const { checkDatabaseStatus } = require('../modules/database');
const { checkConfigStatus } = require('../modules/config');
const { checkDeploymentStatus } = require('../modules/deployment');
const { checkServicesStatus } = require('../modules/services');

async function statusCommand(options) {
  console.log(chalk.blue.bold('\n📊 Rovo Dev CLI - System Status\n'));

  const results = {
    database: null,
    config: null,
    deployment: null,
    services: null
  };

  try {
    // Check database
    const dbSpinner = ora('Checking database...').start();
    try {
      results.database = await checkDatabaseStatus(options.verbose);
      dbSpinner.succeed(chalk.green('Database: Connected'));
      
      if (options.verbose) {
        console.log(chalk.gray(`  Tables: ${results.database.tables}`));
        console.log(chalk.gray(`  Total Records: ${results.database.totalRecords}`));
        console.log(chalk.gray(`  Last Update: ${results.database.lastUpdate}`));
      }
    } catch (error) {
      dbSpinner.fail(chalk.red('Database: Error'));
      if (options.verbose) {
        console.error(chalk.gray(`  ${error.message}`));
      }
    }

    // Check configuration
    const configSpinner = ora('Checking configuration...').start();
    try {
      results.config = await checkConfigStatus(options.verbose);
      const missingVars = results.config.missing || [];
      
      if (missingVars.length === 0) {
        configSpinner.succeed(chalk.green('Configuration: Complete'));
      } else {
        configSpinner.warn(chalk.yellow(`Configuration: ${missingVars.length} missing variables`));
        if (options.verbose) {
          console.log(chalk.gray(`  Missing: ${missingVars.join(', ')}`));
        }
      }
    } catch (error) {
      configSpinner.fail(chalk.red('Configuration: Error'));
      if (options.verbose) {
        console.error(chalk.gray(`  ${error.message}`));
      }
    }

    // Check deployment
    const deploySpinner = ora('Checking deployment...').start();
    try {
      results.deployment = await checkDeploymentStatus(options.verbose);
      
      if (results.deployment.healthy) {
        deploySpinner.succeed(chalk.green(`Deployment: ${results.deployment.status}`));
        if (options.verbose) {
          console.log(chalk.gray(`  URL: ${results.deployment.url}`));
          console.log(chalk.gray(`  Last Deploy: ${results.deployment.lastDeploy}`));
        }
      } else {
        deploySpinner.warn(chalk.yellow(`Deployment: ${results.deployment.status}`));
      }
    } catch (error) {
      deploySpinner.fail(chalk.red('Deployment: Error'));
      if (options.verbose) {
        console.error(chalk.gray(`  ${error.message}`));
      }
    }

    // Check external services
    const servicesSpinner = ora('Checking external services...').start();
    try {
      results.services = await checkServicesStatus(options.verbose);
      
      const healthyServices = Object.values(results.services).filter(s => s.status === 'ok').length;
      const totalServices = Object.keys(results.services).length;
      
      if (healthyServices === totalServices) {
        servicesSpinner.succeed(chalk.green(`Services: All operational (${totalServices}/${totalServices})`));
      } else {
        servicesSpinner.warn(chalk.yellow(`Services: ${healthyServices}/${totalServices} operational`));
      }

      if (options.verbose) {
        Object.entries(results.services).forEach(([name, status]) => {
          const icon = status.status === 'ok' ? '✓' : '✗';
          const color = status.status === 'ok' ? chalk.green : chalk.red;
          console.log(color(`  ${icon} ${name}: ${status.message}`));
        });
      }
    } catch (error) {
      servicesSpinner.fail(chalk.red('Services: Error'));
      if (options.verbose) {
        console.error(chalk.gray(`  ${error.message}`));
      }
    }

    // Output JSON if requested
    if (options.json) {
      console.log('\n' + JSON.stringify(results, null, 2));
    } else {
      console.log(chalk.green.bold('\n✅ Status check completed!\n'));
    }

  } catch (error) {
    console.error(chalk.red('\n❌ Status check failed:'), error.message);
    if (options.verbose) {
      console.error(chalk.gray(error.stack));
    }
    process.exit(1);
  }
}

module.exports = statusCommand;
