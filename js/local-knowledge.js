export function guideAnswer(question,language){
 const q=String(question||'').toLocaleLowerCase();
 const basic=/\b(what is|what are|explain|define|example of)\b|nədir|izah et|nümunə/iu.test(q);
 const az=language==='az';
 if(basic&&/\bvariables?\b|dəyişən/iu.test(q))return az?
  'Python-da dəyişən bir dəyərə verilən addır. Məsələn, `age = 16` yazanda `age` adı 16 dəyərini saxlayır; sonra `print(age)` həmin dəyəri göstərir. `age = 17` yazmaq da düzgündür: dəyişənin dəyəri yenilənir. Səncə `name = "Aysel"` sətirində dəyişənin adı hansıdır?':
  'A Python variable is a name for a value. For example, `age = 16` gives the value 16 the name `age`, and `print(age)` displays it. You can later write `age = 17` to update it. In `name = "Aysel"`, which part is the variable name?';
 if(basic&&/\bloops?\b|dövr|təkrar/iu.test(q))return az?
  'Dövr eyni əməliyyatı təkrar edir. Python-da `for n in range(3): print(n)` 0, 1 və 2-ni çap edir. `range(3)` üç addım yaradır; 3 özü daxil deyil. Hansı halda dövr yazmaq üç ayrı `print` sətrindən daha rahatdır?':
  'A loop repeats an action. In Python, `for n in range(3): print(n)` prints 0, 1, and 2. `range(3)` produces three steps; it does not include 3. When would a loop be clearer than three separate `print` lines?';
 if(basic&&/\bfunctions?\b|funksiya/iu.test(q))return az?
  'Funksiya təkrar istifadə edilən kiçik tapşırıqdır. `def double(x): return x * 2` funksiyası verilən ədədi ikiqat edir; `double(4)` nəticəsi 8-dir. Burada `x` giriş, `return` isə nəticədir. 5-i ikiqat etmək üçün nə yazardın?':
  'A function packages a reusable task. `def double(x): return x * 2` doubles its input, so `double(4)` gives 8. Here `x` is the input and `return` provides the result. How would you double 5?';
 if(basic&&/react/iu.test(q)&&/component|komponent/iu.test(q))return az?
  'React komponenti interfeysin təkrar istifadə edilən hissəsidir. Məsələn, `function Greeting({name}) { return <h2>Salam, {name}!</h2>; }` komponentini `<Greeting name="Aysel" />` kimi istifadə edə bilərsən. `name` prop-u məzmunu dəyişir. Eyni komponenti başqa ad üçün necə istifadə edərdin?':
  'A React component is a reusable piece of the interface. For example, `function Greeting({name}) { return <h2>Hello, {name}!</h2>; }` can be used as `<Greeting name="Aysel" />`. The `name` prop changes its content. How would you reuse it for another name?';
 if(/20.minute|20 minute|20 dəqiqə|20.deqiqe/iu.test(q)&&/plan|schedule|cədvəl/iu.test(q))return az?
  '20 dəqiqəlik plan: 3 dəqiqə məqsədi seç, 7 dəqiqə bir anlayışı öyrən, 7 dəqiqə kiçik məşq et, 3 dəqiqə nəticəni yaz və sualını qeyd et. Bu gün hansı mövzunu seçirsən?':
  'Try this 20-minute plan: 3 minutes to choose one goal, 7 minutes to learn one concept, 7 minutes for a small exercise, and 3 minutes to summarize what worked and note one question. Which topic will you use today?';
 return null;
}
