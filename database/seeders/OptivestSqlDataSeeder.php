<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use RuntimeException;

class OptivestSqlDataSeeder extends Seeder
{
    private const SQL_FILE = 'seeders/data/optivest_app.sql';

    private const INCLUDED_TABLES = [
        'banks',
        'daily_savings',
        'investment_plan_categories',
        'investment_plans',
        'investments',
        'loan_plans',
        'loans',
        'loan_repayments',
        'manual_payment_methods',
        'monnify_transactions',
        'payouts',
        'referral_bonuses',
        'referral_settings',
        'referrals',
        'savings',
        'savings_plans',
        'settings',
        'transactions',
    ];

    private const TABLE_ORDER = [
        'banks',
        'manual_payment_methods',
        'referral_settings',
        'investment_plan_categories',
        'investment_plans',
        'savings_plans',
        'loan_plans',
        'monnify_transactions',
        'transactions',
        'investments',
        'savings',
        'daily_savings',
        'loans',
        'loan_repayments',
        'payouts',
        'referrals',
        'referral_bonuses',
        'settings',
    ];

    private const USER_REFERENCE_COLUMNS = [
        'user_id' => 'user',
        'created_by' => 'admin',
        'last_updated_by' => 'admin',
        'approved_by' => 'admin',
        'rejected_by' => 'admin',
        'confirmed_by' => 'admin',
        'processed_by' => 'admin',
    ];

    private const EMPTY_STRING_TO_NULL_COLUMNS = [
        'daily_savings' => ['transaction_reference'],
        'monnify_transactions' => ['payment_reference'],
        'transactions' => ['payment_reference', 'reference'],
    ];

    private array $schemaColumns = [];

    private array $existingUserIds = [];

    private ?int $fallbackUserId = null;

    private ?int $fallbackAdminId = null;

    public function run(): void
    {
        $sqlPath = env('OPTIVEST_SQL_SEED_PATH') ?: database_path(self::SQL_FILE);

        if (! is_file($sqlPath)) {
            throw new RuntimeException("OptiVest SQL seed file was not found at: {$sqlPath}");
        }

        $this->loadUserFallbacks();

        $sql = file_get_contents($sqlPath);

        if ($sql === false) {
            throw new RuntimeException("OptiVest SQL seed file could not be read at: {$sqlPath}");
        }

        $recordsByTable = $this->collectRecords($sql);
        $seededTables = [];

        foreach (self::TABLE_ORDER as $table) {
            if (! empty($recordsByTable[$table])) {
                $this->seedTable($table, $recordsByTable[$table]);
                $seededTables[] = $table;
                unset($recordsByTable[$table]);
            }
        }

        foreach ($recordsByTable as $table => $records) {
            if (! empty($records)) {
                $this->seedTable($table, $records);
                $seededTables[] = $table;
            }
        }

        $this->command?->info('OptiVest SQL data seeded for: '.implode(', ', $seededTables));
    }

    private function collectRecords(string $sql): array
    {
        $recordsByTable = [];
        $offset = 0;

        while (preg_match('/INSERT INTO `([^`]+)`/i', $sql, $match, PREG_OFFSET_CAPTURE, $offset)) {
            $table = $match[1][0];
            $start = $match[0][1];
            $end = $this->findStatementEnd($sql, $start);

            if ($end === null) {
                break;
            }

            $offset = $end + 1;

            if (! in_array($table, self::INCLUDED_TABLES, true)) {
                continue;
            }

            if (! Schema::hasTable($table)) {
                $this->command?->warn("Skipping {$table}: table does not exist in the current schema.");
                continue;
            }

            $statement = trim(substr($sql, $start, $end - $start + 1));

            if (! preg_match('/^INSERT INTO `([^`]+)`\s*\((.*?)\)\s*VALUES\s*(.*);$/is', $statement, $parts)) {
                $this->command?->warn("Skipping {$table}: unsupported INSERT format.");
                continue;
            }

            preg_match_all('/`([^`]+)`/', $parts[2], $columnMatches);

            $columns = $columnMatches[1] ?? [];
            $rows = $this->parseValueRows($parts[3]);
            $records = $this->rowsToRecords($table, $columns, $rows);

            if (! empty($records)) {
                $recordsByTable[$table] = array_merge($recordsByTable[$table] ?? [], $records);
            }
        }

        return $recordsByTable;
    }

    private function rowsToRecords(string $table, array $columns, array $rows): array
    {
        $schemaColumns = array_flip($this->columnsFor($table));
        $columnMap = [];

        foreach ($columns as $index => $column) {
            if (isset($schemaColumns[$column])) {
                $columnMap[$index] = $column;
            }
        }

        if ($columnMap === []) {
            $this->command?->warn("Skipping {$table}: none of the dump columns exist in the current schema.");

            return [];
        }

        $records = [];

        foreach ($rows as $row) {
            $record = [];

            foreach ($columnMap as $index => $column) {
                if (array_key_exists($index, $row)) {
                    $record[$column] = $row[$index];
                }
            }

            if ($record !== []) {
                $records[] = $this->remapUserReferences($this->normalizeRecord($table, $record));
            }
        }

        return $records;
    }

    private function normalizeRecord(string $table, array $record): array
    {
        foreach (self::EMPTY_STRING_TO_NULL_COLUMNS[$table] ?? [] as $column) {
            if (array_key_exists($column, $record) && $record[$column] === '') {
                $record[$column] = null;
            }
        }

        return $record;
    }

    private function seedTable(string $table, array $records): void
    {
        foreach (array_chunk($records, 100) as $chunk) {
            $firstRecord = reset($chunk);

            if (array_key_exists('id', $firstRecord) && count($firstRecord) > 1) {
                $updateColumns = array_values(array_diff(array_keys($firstRecord), ['id']));
                DB::table($table)->upsert($chunk, ['id'], $updateColumns);

                continue;
            }

            DB::table($table)->insertOrIgnore($chunk);
        }
    }

    private function loadUserFallbacks(): void
    {
        if (! Schema::hasTable('users')) {
            return;
        }

        $this->existingUserIds = DB::table('users')->pluck('id')->map(fn ($id) => (int) $id)->all();
        $adminId = DB::table('users')
            ->whereIn('type', ['admin', 'staff'])
            ->orderBy('id')
            ->value('id');
        $userId = DB::table('users')
            ->where('type', 'user')
            ->orderBy('id')
            ->value('id');

        $this->fallbackAdminId = $adminId !== null ? (int) $adminId : ($this->existingUserIds[0] ?? null);
        $this->fallbackUserId = $userId !== null ? (int) $userId : ($this->fallbackAdminId ?? null);
    }

    private function remapUserReferences(array $record): array
    {
        foreach (self::USER_REFERENCE_COLUMNS as $column => $fallbackType) {
            if (! array_key_exists($column, $record) || $record[$column] === null) {
                continue;
            }

            $userId = (int) $record[$column];

            if (in_array($userId, $this->existingUserIds, true)) {
                continue;
            }

            $fallbackId = $fallbackType === 'user' ? $this->fallbackUserId : $this->fallbackAdminId;

            if ($fallbackId === null) {
                throw new RuntimeException("Cannot seed {$column} references without an existing users row. Run AdminUserSeeder first.");
            }

            $record[$column] = $fallbackId;
        }

        return $record;
    }

    private function columnsFor(string $table): array
    {
        if (! isset($this->schemaColumns[$table])) {
            $this->schemaColumns[$table] = Schema::getColumnListing($table);
        }

        return $this->schemaColumns[$table];
    }

    private function findStatementEnd(string $sql, int $start): ?int
    {
        $inString = false;
        $length = strlen($sql);

        for ($index = $start; $index < $length; $index++) {
            $char = $sql[$index];

            if ($inString) {
                if ($char === '\\') {
                    $index++;
                    continue;
                }

                if ($char === "'") {
                    $inString = false;
                }

                continue;
            }

            if ($char === "'") {
                $inString = true;
                continue;
            }

            if ($char === ';') {
                return $index;
            }
        }

        return null;
    }

    private function parseValueRows(string $valuesSql): array
    {
        $rows = [];
        $row = [];
        $token = '';
        $tokenWasString = false;
        $inString = false;
        $depth = 0;
        $length = strlen($valuesSql);

        for ($index = 0; $index < $length; $index++) {
            $char = $valuesSql[$index];

            if ($inString) {
                if ($char === '\\' && $index + 1 < $length) {
                    $token .= $this->decodeEscapedChar($valuesSql[++$index]);
                    continue;
                }

                if ($char === "'") {
                    $inString = false;
                    continue;
                }

                $token .= $char;
                continue;
            }

            if ($char === "'") {
                $inString = true;
                $tokenWasString = true;
                continue;
            }

            if (ctype_space($char) && ($tokenWasString || $token === '')) {
                continue;
            }

            if ($char === '(' && $depth === 0) {
                $depth = 1;
                $row = [];
                $token = '';
                $tokenWasString = false;
                continue;
            }

            if ($depth === 0) {
                continue;
            }

            if ($char === ',' && $depth === 1) {
                $row[] = $this->normalizeSqlValue($token, $tokenWasString);
                $token = '';
                $tokenWasString = false;
                continue;
            }

            if ($char === ')' && $depth === 1) {
                $row[] = $this->normalizeSqlValue($token, $tokenWasString);
                $rows[] = $row;
                $depth = 0;
                $token = '';
                $tokenWasString = false;
                continue;
            }

            $token .= $char;
        }

        return $rows;
    }

    private function normalizeSqlValue(string $token, bool $wasString): mixed
    {
        if ($wasString) {
            return $token;
        }

        $value = trim($token);

        if (strcasecmp($value, 'NULL') === 0) {
            return null;
        }

        if (is_numeric($value)) {
            return str_contains($value, '.') ? (float) $value : (int) $value;
        }

        return $value;
    }

    private function decodeEscapedChar(string $char): string
    {
        return match ($char) {
            '0' => "\0",
            'b' => "\b",
            'n' => "\n",
            'r' => "\r",
            't' => "\t",
            'Z' => chr(26),
            default => $char,
        };
    }
}
