import 'dotenv/config';
import { FraudAction, FraudRuleType } from '@app/common/types/fraud-rules.types';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { fraudRules } from '../src/infrastructure/database/fraud-rules.schema';

const DATABASE_URL = process.env.ANTIFRAUD_DB_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';

async function seedDefaultRules() {
    const client = postgres(DATABASE_URL);
    const db = drizzle(client);

    console.log('🌱 Seeding default fraud rules...');

    const defaultRules = [
        {
            name: 'High Amount Transaction',
            description: 'Reject transactions greater than 1000',
            ruleType: FraudRuleType.AMOUNT_THRESHOLD,
            condition: {
                operator: 'gt',
                value: 1000,
            },
            action: FraudAction.REJECT,
            priority: 100,
            isActive: true,
        },
        {
            name: 'Very High Amount - Review',
            description: 'Flag transactions greater than 5000 for review',
            ruleType: FraudRuleType.AMOUNT_THRESHOLD,
            condition: {
                operator: 'gt',
                value: 5000,
            },
            action: FraudAction.REVIEW,
            priority: 50,
            isActive: false, // Desactivada por defecto (activar manualmente si se requiere)
        },
        {
            name: 'Weekend Transfer Limit',
            description: 'Restrict high-value transfers on weekends',
            ruleType: FraudRuleType.TIME_BASED,
            condition: {
                allowedHours: { start: 0, end: 23 },
                allowedDays: [1, 2, 3, 4, 5], // Lunes a viernes
            },
            action: FraudAction.REJECT,
            priority: 200,
            isActive: false, // Desactivada por defecto
        },
        {
            name: 'Payment Type Limit',
            description: 'Limit payment type transactions to 500',
            ruleType: FraudRuleType.TRANSFER_TYPE_LIMIT,
            condition: {
                transferTypeId: 2, // PAYMENT
                maxAmount: 500,
            },
            action: FraudAction.REJECT,
            priority: 150,
            isActive: false, // Desactivada por defecto
        },
    ];

    for (const rule of defaultRules) {
        await db.insert(fraudRules).values(rule);
        console.log(`✅ Created rule: ${rule.name}`);
    }

    console.log('🎉 Default rules seeded successfully!');
    await client.end();
}

seedDefaultRules().catch((error) => {
    console.error('❌ Error seeding rules:', error);
    process.exit(1);
});
