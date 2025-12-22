/**
 * Init Command - Initialize project configuration
 */

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');

async function initCommand(options) {
  console.log(chalk.blue.bold('\n🚀 Rovo Dev CLI - Project Initialization\n'));

  try {
    if (options.interactive) {
      await interactiveSetup();
    } else if (options.template) {
      await templateSetup(options.template);
    } else {
      await quickSetup();
    }

    console.log(chalk.green.bold('\n✅ Initialization completed!\n'));
    console.log(chalk.blue('Next steps:'));
    console.log(chalk.gray('  1. Review and update .env file'));
    console.log(chalk.gray('  2. Setup Supabase: psql < supabase/schema.sql'));
    console.log(chalk.gray('  3. Deploy: npm run deploy'));
    console.log(chalk.gray('  4. Check status: rovodev status\n'));

  } catch (error) {
    console.error(chalk.red('\n❌ Initialization failed:'), error.message);
    console.error(chalk.gray(error.stack));
    process.exit(1);
  }
}

async function interactiveSetup() {
  console.log(chalk.blue('Interactive Setup Wizard\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: 'ai-call-center-mvp'
    },
    {
      type: 'list',
      name: 'environment',
      message: 'Environment:',
      choices: ['development', 'staging', 'production']
    },
    {
      type: 'confirm',
      name: 'setupSupabase',
      message: 'Setup Supabase connection?',
      default: true
    },
    {
      type: 'input',
      name: 'supabaseUrl',
      message: 'Supabase URL:',
      when: (answers) => answers.setupSupabase
    },
    {
      type: 'password',
      name: 'supabaseKey',
      message: 'Supabase Service Key:',
      when: (answers) => answers.setupSupabase
    },
    {
      type: 'list',
      name: 'llmProvider',
      message: 'LLM Provider:',
      choices: ['OpenAI', 'Anthropic', 'Yandex GPT']
    },
    {
      type: 'password',
      name: 'llmApiKey',
      message: 'LLM API Key:'
    },
    {
      type: 'confirm',
      name: 'setupYandex',
      message: 'Setup Yandex SpeechKit?',
      default: true
    },
    {
      type: 'password',
      name: 'yandexApiKey',
      message: 'Yandex API Key:',
      when: (answers) => answers.setupYandex
    },
    {
      type: 'input',
      name: 'yandexFolderId',
      message: 'Yandex Folder ID:',
      when: (answers) => answers.setupYandex
    }
  ]);

  // Create .env file
  const spinner = ora('Creating configuration file...').start();
  await createEnvFile(answers);
  spinner.succeed(chalk.green('Configuration file created'));
}

async function quickSetup() {
  console.log(chalk.blue('Quick Setup\n'));
  
  const spinner = ora('Copying .env.example to .env...').start();
  
  try {
    const envExample = await fs.readFile(path.join(process.cwd(), '.env.example'), 'utf-8');
    await fs.writeFile(path.join(process.cwd(), '.env'), envExample);
    spinner.succeed(chalk.green('.env file created'));
    
    console.log(chalk.yellow('\n⚠️  Please update .env with your actual credentials'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to create .env file'));
    throw error;
  }
}

async function templateSetup(templateName) {
  console.log(chalk.blue(`Template Setup: ${templateName}\n`));
  
  const templates = {
    'development': {
      NODE_ENV: 'development',
      // Add development-specific defaults
    },
    'production': {
      NODE_ENV: 'production',
      // Add production-specific defaults
    }
  };

  const template = templates[templateName];
  if (!template) {
    throw new Error(`Template '${templateName}' not found`);
  }

  // Apply template
  const spinner = ora('Applying template...').start();
  await createEnvFile(template);
  spinner.succeed(chalk.green('Template applied'));
}

async function createEnvFile(config) {
  const envContent = [];

  envContent.push('# Supabase Configuration');
  envContent.push(`SUPABASE_URL=${config.supabaseUrl || 'https://your-project.supabase.co'}`);
  envContent.push(`SUPABASE_ANON_KEY=${config.supabaseAnonKey || 'your-anon-key-here'}`);
  envContent.push(`SUPABASE_SERVICE_KEY=${config.supabaseKey || 'your-service-role-key-here'}`);
  envContent.push('');

  envContent.push('# Yandex SpeechKit (for Russian AI calls)');
  envContent.push(`YANDEX_API_KEY=${config.yandexApiKey || 'your-yandex-api-key'}`);
  envContent.push(`YANDEX_FOLDER_ID=${config.yandexFolderId || 'your-yandex-folder-id'}`);
  envContent.push('');

  envContent.push('# LLM Provider');
  if (config.llmProvider === 'OpenAI') {
    envContent.push(`OPENAI_API_KEY=${config.llmApiKey || 'your-openai-api-key'}`);
  } else if (config.llmProvider === 'Anthropic') {
    envContent.push(`ANTHROPIC_API_KEY=${config.llmApiKey || 'your-anthropic-api-key'}`);
  } else if (config.llmProvider === 'Yandex GPT') {
    envContent.push(`YANDEX_GPT_API_KEY=${config.llmApiKey || 'your-yandex-gpt-key'}`);
  }
  envContent.push('');

  envContent.push('# Environment');
  envContent.push(`NODE_ENV=${config.environment || 'development'}`);
  envContent.push('');

  await fs.writeFile(path.join(process.cwd(), '.env'), envContent.join('\n'));
}

module.exports = initCommand;
