# 🚀 New Exercise Dataset 

What's Inside Our New Dataset
- 3,000+ exercises
- High-quality video demonstration.
- High-quality images
- Multilingual supports
- Many More..

## Note: Enterprise Solutions
If you're building an application and need complete control over the exercise data, we offer offline dataset access instead of API as SaaS. This includes:

- Full offline access to all 3,000+ exercises
- with montly/annually subscription
- Regular dataset updates
- Custom data formats
- Unlimited usage rights
- Direct technical support
- Integration assistance

Exercise sample
```sh
{
  "exerciseId": "K6NnTv0",
  "name": "Bench Press",
  "imageUrl": "Barbell-Bench-Press_Chest-FIX_small.png",
  "equipments": ["Barbell"],
  "bodyParts": ["Chest"],
  "exerciseType": "weight_reps",
  "targetMuscles": ["Pectoralis Major Clavicular Head"],
  "secondaryMuscles": [
    "Deltoid Anterior",
    "Pectoralis Major Clavicular Head",
    "Triceps Brachii"
  ],
  "videoUrl": "Barbell-Bench-Press_Chest-FIX2_.mp4",
  "keywords": [
    "Chest workout with barbell",
    "Barbell bench press exercise",
    "Strength training for chest",
    "Upper body workout with barbell",
    "Barbell chest exercises",
    "Bench press for chest muscles",
    "Building chest muscles with bench press",
    "Chest strengthening with barbell",
    "Bench press workout routine",
    "Barbell exercises for chest muscle growth"
  ],
  "overview": "The Bench Press is a classic strength training exercise that primarily targets the chest, shoulders, and triceps, contributing to upper body muscle development. It is suitable for anyone, from beginners to professional athletes, looking to improve their upper body strength and muscular endurance. Individuals may want to incorporate bench press into their routine for its effectiveness in enhancing physical performance, promoting bone health, and improving body composition.",
  "instructions": [
    "Grip the barbell with your hands slightly wider than shoulder-width apart, palms facing your feet, and lift it off the rack, holding it straight over your chest with your arms fully extended.",
    "Slowly lower the barbell down to your chest while keeping your elbows at a 90-degree angle.",
    "Once the barbell touches your chest, push it back up to the starting position while keeping your back flat on the bench.",
    "Repeat this process for the desired number of repetitions, always maintaining control of the barbell and ensuring your form is correct."
  ],
  "exerciseTips": [
    "Avoid Arching Your Back: One common mistake is excessively arching the back during the lift. This can lead to lower back injuries. Your lower back should have a natural arch, but it should not be overly exaggerated. Your butt, shoulders, and head should maintain contact with the bench at all times.",
    "Controlled Movement: Avoid the temptation to lift the barbell too quickly. A controlled, steady lift is more effective and reduces the risk of injury. Lower the bar to your mid-chest slowly, pause briefly, then push it back up without locking your elbows at the top.",
    "Don't Lift Alone:"
  ],
  "variations": [
    "Decline Bench Press: This variation is performed on a decline bench to target the lower part of the chest.",
    "Close-Grip Bench Press: This variation focuses on the triceps and the inner part of the chest by placing the hands closer together on the bar.",
    "Dumbbell Bench Press: This variation uses dumbbells instead of a barbell, allowing for a greater range of motion and individual arm movement.",
    "Reverse-Grip Bench Press: This variation is performed by flipping your grip so that your palms face towards you, targeting the upper chest and triceps."
  ],
  "relatedExerciseIds": [
    "U0uPZBq",
    "QD32SbB",
    "pdm4AfV",
    "SebLXCG",
    "T3JogV7",
    "hiWPEs1",
    "Y5ppDdt",
    "C8OV7Pv",
    "r3tQt3U",
    "dCSgT7N"
  ]
}
```
Sample Image
  
![Bench Press Exercise](https://ucarecdn.com/c12bb487-7390-4fc7-903c-a1c2298e70ad/K6NnTv0__BarbellBenchPress_Chest.png)

Sample Video

https://github.com/user-attachments/assets/6845a963-4d80-4dfd-b602-e49616a9483f

For inquiries:

Email: cyberboyanmol@gmail.com
Telegram: [@cyberboyanmol](https://t.me/cyberboyanmol) (fast response)











# ExerciseDB API

![GitHub License](https://img.shields.io/github/license/cyberboyanmol/exercisedb-api)
![GitHub Release](https://img.shields.io/github/v/release/cyberboyanmol/exercisedb-api)

ExerciseDB API, accessible at [exercisedb-api.vercel.app](https://exercisedb-api.vercel.app/), is an exercises API that allows users to access high-quality exercises data which consists 1300+ exercises. This API offers extensive information on each exercise, including target body parts, equipment needed, GIFs for visual guidance, and step-by-step instructions.

## ⚠️ Important Notice
The unauthorized downloading, scraping, or bulk collection of data from this API is strictly prohibited. This API is intended for individual exercise lookups and legitimate application integration only. If you need access to the complete dataset or have specific requirements, please contact via Telegram at [@cyberboyanmol](https://t.me/cyberboyanmol). We're happy to discuss proper data usage and potential collaborations.

## 📚 Documentation

Check out the [API documentation](https://exercisedb-api.vercel.app/docs) for detailed information on how to use the API.

## Sample Dataset

```sh
 {
        "exerciseId": "guT8YnS",
        "name": "biceps pull-up",
        "gifUrl": "https://cdn-exercisedb.vercel.app/api/v1/images/guT8YnS.gif",
        "instructions": [
          "Step:1 Hang from a pull-up bar with your palms facing away from you and your hands shoulder-width apart.",
          "Step:2 Engage your core and pull yourself up by bending your elbows, bringing your chest towards the bar.",
          "Step:3 Pause at the top of the movement, then slowly lower yourself back down to the starting position.",
          "Step:4 Repeat for the desired number of repetitions."
        ],
        "targetMuscles": [
          "biceps"
        ],
        "bodyParts": [
          "upper arms"
        ],
        "equipments": [
          "body weight"
        ],
        "secondaryMuscles": [
          "forearms",
          "shoulders"
        ]
 }
```
![Chest Dip Exercise](https://ucarecdn.com/02aab038-31da-4127-af94-30cfbb93d47f/guT8YnS.gif)


## 📰 Changelog

For a detailed list of changes, see the [CHANGELOG](CHANGELOG.md).

## 🔌 Running Locally

> [!NOTE]
> You need `Bun(1.1.25+)` or `Node.js(v20+)`

1. Clone the repository:

   ```sh
   git clone https://github.com/cyberboyanmol/exercisedb-api
   cd exercisedb-api
   ```

2. Install the required dependencies:

   ```sh
   bun install
   ```

3. Launch the development server:

   ```sh
   bun run dev
   ```

## ☁️ Deploying Your Own Instance

You can easily deploy your own instance of the API by clicking the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cyberboyanmol/exercisedb-api)

## 📜 License

This project is distributed under the [MIT License](https://opensource.org/licenses/MIT). For more information, see the issue [ISSUE](https://github.com/cyberboyanmol/exercisedb-api/issues/3) included in this repository.
