g = [["1148", "435", 1539942700133],
     ["1144", "435", 1539942700153],
     ["1135", "435", 1539942700171],
     ["1111", "438", 1539942700187],
     ["1072", "444", 1539942700204],
     ["953", "459", 1539942700222],
     ["859", "465", 1539942700237],
     ["753", "469", 1539942700254],
     ["676", "471", 1539942700271],
     ["629", "472", 1539942700289],
     ["532", "475", 1539942700304],
     ["496", "475", 1539942700321],
     ["467", "475", 1539942700337],
     ["451", "473", 1539942700354],
     ["447", "470", 1539942700371],
     ["444", "470", 1539942700655],
     ["429", "474", 1539942700671],
     ["407", "480", 1539942700689],
     ["366", "484", 1539942700705],
     ["264", "490", 1539942700721],
     ["153", "490", 1539942700740],
     ["24", "475", 1539942700756],
     ["26", "322", 1539942724174],
     ["742", "745", 1539942724942],
     ["678", "459", 1539942759249],
     ["678", "459", 1539942760824],
     ["1017", "252", 1539943023805],
     ["1017", "254", 1539943024408],
     ["1017", "260", 1539943024424],
     ["1017", "268", 1539943024441],
     ["1017", "280", 1539943024457],
     ["1017", "289", 1539943024475],
     ["1017", "300", 1539943024494],
     ["1017", "308", 1539943024507],
     ["1016", "314", 1539943024527],
     ["1016", "318", 1539943024545],
     ["1016", "322", 1539943024559],
     ["1015", "326", 1539943024573],
     ["1015", "331", 1539943024590],
     ["1015", "333", 1539943027416],
     ["1015", "336", 1539943027432],
     ["1016", "340", 1539943027449],
     ["1018", "348", 1539943027465],
     ["1019", "354", 1539943027482],
     ["1020", "358", 1539943027499],
     ["1021", "363", 1539943027515],
     ["1021", "367", 1539943027532],
     ["1021", "370", 1539943027549],
     ["1021", "374", 1539943027565],
     ["1021", "377", 1539943027584],
     ["1020", "380", 1539943027599],
     ["1020", "381", 1539943027616],
     ["1020", "383", 1539943027631],
     ["1019", "386", 1539943027648],
     ["1019", "389", 1539943027665],
     ["1018", "393", 1539943027682],
     ["1018", "399", 1539943027699],
     ["1017", "407", 1539943027715],
     ["1015", "411", 1539943027732],
     ["1014", "416", 1539943027751],
     ["1014", "418", 1539943027765],
     ["1013", "420", 1539943027782],
     ["1013", "420", 1539943027799],
     ["1013", "421", 1539943027816],
     ["1013", "421", 1539943027905],
     ["1013", "421", 1539943027917],
     ["1013", "423", 1539943027933],
     ["1012", "423", 1539943027949]]

import execjs

obj = execjs.compile(open('./conver_loc.js').read())
d = obj.call('gc', g)
