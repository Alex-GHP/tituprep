export interface Question {
  id: number
  text: string
  code?: string
  options: string[]
  correctIndex: number
  explanation: string
  subject: string
}

export interface Subject {
  id: string
  name: { en: string; ro: string }
  questionCount: number
  bestScore: number | null
  progress: number
}

export interface ExamResult {
  examId: number
  score: number
  total: number
  answers: { questionId: number; selectedIndex: number | null; correct: boolean }[]
  date: string
}

export const subjects: Subject[] = [
  { id: "fp", name: { en: "Programming Fundamentals", ro: "Fundamentele Programarii" }, questionCount: 45, bestScore: 8.5, progress: 60 },
  { id: "dsa", name: { en: "Data Structures & Algorithms", ro: "Structuri de Date si Algoritmi" }, questionCount: 50, bestScore: 7.0, progress: 40 },
  { id: "oop", name: { en: "Object-Oriented Programming", ro: "Programare Orientata pe Obiecte" }, questionCount: 40, bestScore: null, progress: 0 },
  { id: "db", name: { en: "Databases", ro: "Baze de Date" }, questionCount: 35, bestScore: 9.0, progress: 80 },
  { id: "os", name: { en: "Operating Systems", ro: "Sisteme de Operare" }, questionCount: 30, bestScore: null, progress: 0 },
  { id: "cn", name: { en: "Computer Networks", ro: "Retele de Calculatoare" }, questionCount: 38, bestScore: 6.5, progress: 25 },
  { id: "se", name: { en: "Software Engineering", ro: "Ingineria Software" }, questionCount: 42, bestScore: 8.0, progress: 55 },
  { id: "ai", name: { en: "Artificial Intelligence", ro: "Inteligenta Artificiala" }, questionCount: 28, bestScore: null, progress: 0 },
]

export const sampleQuestions: Question[] = [
  {
    id: 1,
    text: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctIndex: 1,
    explanation: "Binary search divides the search space in half each step, resulting in O(log n) complexity.",
    subject: "dsa",
  },
  {
    id: 2,
    text: "Which of the following is NOT a principle of OOP?",
    options: ["Encapsulation", "Polymorphism", "Compilation", "Inheritance"],
    correctIndex: 2,
    explanation: "Compilation is a process, not an OOP principle. The four pillars are Encapsulation, Abstraction, Inheritance, and Polymorphism.",
    subject: "oop",
  },
  {
    id: 3,
    text: "What does the following Python function return?",
    code: `def mystery(lst):\n    return [x for x in lst if x % 2 == 0]`,
    options: ["All odd numbers", "All even numbers", "All prime numbers", "Empty list"],
    correctIndex: 1,
    explanation: "The list comprehension filters elements where x % 2 == 0, which selects even numbers.",
    subject: "fp",
  },
  {
    id: 4,
    text: "What is the normal form that eliminates transitive dependencies?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    correctIndex: 2,
    explanation: "Third Normal Form (3NF) requires that no non-prime attribute is transitively dependent on a candidate key.",
    subject: "db",
  },
  {
    id: 5,
    text: "Which scheduling algorithm may cause starvation?",
    options: ["Round Robin", "FCFS", "Shortest Job First", "Random"],
    correctIndex: 2,
    explanation: "SJF can cause starvation for longer processes as shorter ones keep getting prioritized.",
    subject: "os",
  },
  {
    id: 6,
    text: "What layer of the OSI model does TCP operate at?",
    options: ["Network", "Transport", "Session", "Data Link"],
    correctIndex: 1,
    explanation: "TCP is a Transport layer (Layer 4) protocol providing reliable, ordered delivery of data.",
    subject: "cn",
  },
  {
    id: 7,
    text: "What is the output of the following code?",
    code: `stack = []\nstack.append(1)\nstack.append(2)\nstack.append(3)\nstack.pop()\nprint(stack[-1])`,
    options: ["1", "2", "3", "Error"],
    correctIndex: 1,
    explanation: "After pushing 1, 2, 3 and popping 3, the top of the stack (last element) is 2.",
    subject: "dsa",
  },
  {
    id: 8,
    text: "Which design pattern ensures a class has only one instance?",
    options: ["Factory", "Observer", "Singleton", "Strategy"],
    correctIndex: 2,
    explanation: "The Singleton pattern restricts instantiation of a class to a single instance and provides global access to it.",
    subject: "se",
  },
  {
    id: 9,
    text: "What is a heuristic function in A* search?",
    options: ["An exact cost function", "An estimate of cost to goal", "A random selector", "A backtracking method"],
    correctIndex: 1,
    explanation: "In A*, the heuristic h(n) estimates the cost from node n to the goal. It guides the search toward the target.",
    subject: "ai",
  },
  {
    id: 10,
    text: "What is the result of this recursive function call?",
    code: `def f(n):\n    if n <= 1:\n        return n\n    return f(n-1) + f(n-2)\n\nprint(f(6))`,
    options: ["5", "8", "13", "21"],
    correctIndex: 1,
    explanation: "This is the Fibonacci function. f(6) = f(5) + f(4) = 5 + 3 = 8.",
    subject: "fp",
  },
  {
    id: 11,
    text: "Which SQL keyword is used to remove duplicate rows from query results?",
    options: ["UNIQUE", "DISTINCT", "DIFFERENT", "REMOVE"],
    correctIndex: 1,
    explanation: "The DISTINCT keyword filters out duplicate rows from the result set of a SELECT query.",
    subject: "db",
  },
  {
    id: 12,
    text: "What data structure uses FIFO ordering?",
    options: ["Stack", "Queue", "Binary Tree", "Hash Map"],
    correctIndex: 1,
    explanation: "A Queue follows First-In-First-Out (FIFO) ordering, where the first element added is the first one removed.",
    subject: "dsa",
  },
  {
    id: 13,
    text: "What is polymorphism in OOP?",
    options: [
      "Hiding implementation details",
      "Inheriting from multiple classes",
      "Objects taking many forms",
      "Encapsulating data"
    ],
    correctIndex: 2,
    explanation: "Polymorphism allows objects of different types to be treated as objects of a common base type, enabling them to take many forms.",
    subject: "oop",
  },
  {
    id: 14,
    text: "What is a deadlock in operating systems?",
    options: [
      "A process that runs forever",
      "A state where processes wait for each other indefinitely",
      "A memory overflow error",
      "A type of interrupt"
    ],
    correctIndex: 1,
    explanation: "A deadlock occurs when two or more processes are each waiting for the other to release a resource, resulting in indefinite blocking.",
    subject: "os",
  },
  {
    id: 15,
    text: "Which protocol is used for secure web browsing?",
    options: ["HTTP", "FTP", "HTTPS", "SMTP"],
    correctIndex: 2,
    explanation: "HTTPS (HTTP Secure) uses TLS/SSL encryption to secure data transmission between the browser and server.",
    subject: "cn",
  },
  {
    id: 16,
    text: "What does the 'S' in SOLID principles stand for?",
    options: [
      "Single Responsibility Principle",
      "Simple Design Principle",
      "Structured Programming Principle",
      "System Integration Principle"
    ],
    correctIndex: 0,
    explanation: "The 'S' in SOLID stands for Single Responsibility Principle - a class should have only one reason to change.",
    subject: "se",
  },
  {
    id: 17,
    text: "What is the purpose of a perceptron in AI?",
    options: [
      "Data storage",
      "Binary classification",
      "Sorting data",
      "Network routing"
    ],
    correctIndex: 1,
    explanation: "A perceptron is a simple neural network model used for binary classification tasks, separating data into two categories.",
    subject: "ai",
  },
  {
    id: 18,
    text: "What is the worst-case time complexity of quicksort?",
    code: `def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[0]\n    left = [x for x in arr[1:] if x <= pivot]\n    right = [x for x in arr[1:] if x > pivot]\n    return quicksort(left) + [pivot] + quicksort(right)`,
    options: ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"],
    correctIndex: 2,
    explanation: "Quicksort's worst case is O(n^2), occurring when the pivot is always the smallest or largest element (already sorted array with first element as pivot).",
    subject: "dsa",
  },
  {
    id: 19,
    text: "What is a foreign key in a relational database?",
    options: [
      "A key that encrypts data",
      "A field that references a primary key in another table",
      "A unique identifier for each row",
      "An index for faster queries"
    ],
    correctIndex: 1,
    explanation: "A foreign key is a field in one table that references the primary key of another table, establishing a relationship between the tables.",
    subject: "db",
  },
  {
    id: 20,
    text: "What is the purpose of virtual memory?",
    options: [
      "To speed up CPU operations",
      "To extend available memory using disk space",
      "To encrypt memory contents",
      "To compress data in RAM"
    ],
    correctIndex: 1,
    explanation: "Virtual memory uses disk space as an extension of RAM, allowing the system to run programs that require more memory than physically available.",
    subject: "os",
  },
]

export function generateExam(examId: number): Question[] {
  const shuffled = [...sampleQuestions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(10, shuffled.length))
}

export function generateSubjectQuestions(subjectId: string): Question[] {
  return sampleQuestions.filter((q) => q.subject === subjectId)
}

export function getExamScores(): { id: number; bestScore: number | null }[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    bestScore: i < 5 ? Math.round((Math.random() * 4 + 6) * 10) / 10 : null,
  }))
}
