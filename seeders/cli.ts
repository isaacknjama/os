#!/usr/bin/env node

import { Command } from 'commander';
import { seed, clean } from './index';

// Create CLI program
const program = new Command();

program
  .name('bitsacco-seeder')
  .description('CLI to seed and clean database for Bitsacco OS')
  .version('1.0.0');

// Seed command
program
  .command('seed')
  .description('Seed database with test data')
  .action(async () => {
    try {
      await seed();
      process.exit(0);
    } catch (error) {
      console.error('Error seeding database:', error);
      process.exit(1);
    }
  });

// Clean command
program
  .command('clean')
  .description('Clean seeded data from database')
  .action(async () => {
    try {
      await clean();
      process.exit(0);
    } catch (error) {
      console.error('Error cleaning database:', error);
      process.exit(1);
    }
  });

// Execute
program.parse(process.argv);
