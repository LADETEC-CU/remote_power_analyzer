import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const phaseData = [
	{
		phase: 1,
		voltage: 123.45,
		current: 456.78,
		power: 987.65,
		power_r: 123.45,
		power_a: 456.78,
		power_factor: 0.5,
		sampleId: 1
	},
	{
		phase: 2,
		voltage: 567.89,
		current: 890.12,
		power: 1234.56,
		power_r: 234.56,
		power_a: 567.89,
		power_factor: 0.6,
		sampleId: 1
	},
	{
		phase: 3,
		voltage: 987.65,
		current: 1234.56,
		power: 1567.89,
		power_r: 345.67,
		power_a: 678.9,
		power_factor: 0.7,
		sampleId: 1
	},
	{
		phase: 1,
		voltage: 123.45,
		current: 456.78,
		power: 987.65,
		power_r: 123.45,
		power_a: 456.78,
		power_factor: 0.5,
		sampleId: 2
	},
	{
		phase: 2,
		voltage: 567.89,
		current: 890.12,
		power: 1234.56,
		power_r: 234.56,
		power_a: 567.89,
		power_factor: 0.6,
		sampleId: 2
	},
	{
		phase: 3,
		voltage: 987.65,
		current: 1234.56,
		power: 1567.89,
		power_r: 345.67,
		power_a: 678.9,
		power_factor: 0.7,
		sampleId: 2
	},
	{
		phase: 1,
		voltage: 123.45,
		current: 456.78,
		power: 987.65,
		power_r: 123.45,
		power_a: 456.78,
		power_factor: 0.5,
		sampleId: 3
	},
	{
		phase: 2,
		voltage: 567.89,
		current: 890.12,
		power: 1234.56,
		power_r: 234.56,
		power_a: 567.89,
		power_factor: 0.6,
		sampleId: 3
	},
	{
		phase: 3,
		voltage: 987.65,
		current: 1234.56,
		power: 1567.89,
		power_r: 345.67,
		power_a: 678.9,
		power_factor: 0.7,
		sampleId: 3
	}
] satisfies Prisma.PhaseDataUncheckedCreateInput[];

async function main() {
	console.log(`Start seeding ...`);
	for (let i = 0; i < 3; i++) {
		const sample = await prisma.sample.create({});
		console.log(`Created sample with id: ${sample.id} at: ${sample.createdAt}`);
	}
	for (const p of phaseData) {
		const phase_data = await prisma.phaseData.create({
			data: p
		});
		const sample = await prisma.sample.findUnique({
			where: {
				id: phase_data.sampleId // Unique identifier of the user you want to find
			}
		});
		console.log(`Created phase data with for phase: ${phase_data.phase} at: ${sample?.createdAt}`);
	}
	console.log(`Seeding finished.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
