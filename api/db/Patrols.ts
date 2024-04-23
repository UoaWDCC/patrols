import prisma from './database';
import { Prisma } from '@prisma/client';

async function createSomeDummyPatrols() {
    const deletePreviousDummy = await prisma.patrols.deleteMany()

    if (!deletePreviousDummy) {
        throw new Error("DB ERROR: Failed to delete previous dummy patrols")
    }

    const dummyPatrols = await prisma.patrols.createMany({
        data: [
            {
                id: 1,
                password: '123',
                email: 'john@cpnz.com',
                name: 'John Smith',
                role: 'patrol lead',
                supervisorID: 0,
            },
            {
                id: 2,
                password: '123',
                email: 'tom@cpnz.com',
                name: 'Tom bruce',
                role: 'patrol',
                supervisorID: 1,
            },
            {
                id: 3,
                password: '123',
                email: 'sam@cpnz.com',
                name: 'Sam Brown',
                role: 'patrol',
                supervisorID: 1,
            },
        ]
    })

    if (!dummyPatrols) {
        throw new Error("DB ERROR: Failed to create dummy patrols data")
    }

    console.log("created " + dummyPatrols.count + " dummy patrols")
}


async function getPatrolCredentials(patrolID: number, emailInput: string, passwordInput: string) {
    const patrol = await prisma.patrols.findUnique({
        where: {
            email: emailInput,
            id: patrolID,
            password: passwordInput
        }
    })

    if (patrol) {
        return patrol
    }

    return null;
}

/**
 * to find correct user and return
 * @param patrolID 
 * @returns
 */
async function testCredentials(emailInput: string) {
    try {
        const patrol = await prisma.patrols.findUnique({
            where: {
                email: emailInput
            }
        })

        if (patrol) {
            return patrol;
        }

        return false;

    } catch(e: any) {
        if(e instanceof Prisma.PrismaClientKnownRequestError) {
            throw e.message
        } else {
            throw e
        }
    }
}


const patrolDb = {
    getPatrolCredentials,
    testCredentials,
    createSomeDummyPatrols
}

export default patrolDb
