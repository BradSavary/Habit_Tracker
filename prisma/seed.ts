import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seed de la base de données...')

  // Créer un utilisateur test avec email vérifié
  const testUserEmail = 'test@example.com'
  const testUserPassword = 'Test1234' // Respecte les règles: 8 chars, maj, min, chiffre

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email: testUserEmail },
  })

  if (existingUser) {
    console.log('⚠️  L\'utilisateur test existe déjà')
    console.log(`   Email: ${testUserEmail}`)
    return
  }

  // Hasher le mot de passe
  const hashedPassword = await hash(testUserPassword, 12)

  // Créer l'utilisateur test
  const testUser = await prisma.user.create({
    data: {
      name: 'Utilisateur Test',
      email: testUserEmail,
      password: hashedPassword,
      emailVerified: new Date(), // ✅ Email déjà vérifié pour les tests
    },
  })

  console.log('✅ Utilisateur test créé avec succès!')
  console.log(`   Nom: ${testUser.name}`)
  console.log(`   Email: ${testUser.email}`)
  console.log(`   Mot de passe: ${testUserPassword}`)
  console.log(`   Email vérifié: ${testUser.emailVerified ? 'Oui' : 'Non'}`)

  // Optionnel: Créer quelques habitudes d'exemple pour l'utilisateur test
  console.log('\n🌱 Création des habitudes d\'exemple...')

  const habits = [
    {
      name: '🏃 Faire du sport',
      description: 'Activité physique quotidienne',
      color: 'green',
      icon: '🏃',
      frequency: 'daily',
      userId: testUser.id,
    },
    {
      name: '📖 Lire 30 minutes',
      description: 'Lecture quotidienne pour s\'enrichir',
      color: 'teal',
      icon: '📖',
      frequency: 'daily',
      userId: testUser.id,
    },
    {
      name: '💧 Boire 2L d\'eau',
      description: 'Rester hydraté tout au long de la journée',
      color: 'blue',
      icon: '💧',
      frequency: 'daily',
      userId: testUser.id,
    },
    {
      name: '🧘 Méditer',
      description: 'Méditation de 10 minutes',
      color: 'purple',
      icon: '🧘',
      frequency: 'daily',
      userId: testUser.id,
    },
  ]

  for (const habit of habits) {
    await prisma.habit.create({
      data: habit,
    })
  }

  console.log(`✅ ${habits.length} habitudes d'exemple créées!`)

  console.log('\n🎉 Seed terminé avec succès!')
  console.log('\n📝 Informations de connexion:')
  console.log(`   Email: ${testUserEmail}`)
  console.log(`   Mot de passe: ${testUserPassword}`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
