import prisma from './database';

async function createSomeDummyPatrols() {
    await prisma.patrols.deleteMany()
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

    if(patrol) {
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
    const patrol = await prisma.patrols.findUnique({
        where: {
            email: emailInput
        }
    })

    if(patrol) {
        return patrol
    }

    return false;
}


const patrolDb = {
    getPatrolCredentials,
    testCredentials,
    createSomeDummyPatrols
}

export default patrolDb
