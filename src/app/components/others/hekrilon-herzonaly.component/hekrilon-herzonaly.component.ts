
import { Component } from '@angular/core';

type GlyphType = 'letter' | 'space' | 'punctuation';

interface HekrilonGlyph {
  id: number;
  character: string;
  type: GlyphType;
  imagePath: string;
  imageFailed: boolean;
}

@Component({
  selector: 'app-hekrilon-herzonaly',
  standalone: false,
  templateUrl: './hekrilon-herzonaly.component.html',
  styleUrl: './hekrilon-herzonaly.component.css'
})
export class HekrilonHerzonalyComponent {

  // A bal oldali mező szövege.
  latinText = '';

  isAlphabetGuideVisible = false;

  // A jobb oldali képes fordítás elemei.
  translatedGlyphs: HekrilonGlyph[] = [];

  // Egy latin betűhöz egy Hekrilön-betűkép tartozik.

  private readonly letterImages: Record<string, string> = {
    A: 'assets/hekrilon/big/A.png',
    B: 'assets/hekrilon/big/B.png',
    C: 'assets/hekrilon/big/C.png',
    D: 'assets/hekrilon/big/D.png',
    E: 'assets/hekrilon/big/E.png',
    F: 'assets/hekrilon/big/F.png',
    G: 'assets/hekrilon/big/G.png',
    H: 'assets/hekrilon/big/H.png',
    I: 'assets/hekrilon/big/I.png',
    J: 'assets/hekrilon/big/J.png',
    K: 'assets/hekrilon/big/K.png',
    L: 'assets/hekrilon/big/L.png',
    M: 'assets/hekrilon/big/M.png',
    N: 'assets/hekrilon/big/N.png',
    O: 'assets/hekrilon/big/O.png',
    P: 'assets/hekrilon/big/P.png',
    Q: 'assets/hekrilon/big/Q.png',
    R: 'assets/hekrilon/big/R.png',
    S: 'assets/hekrilon/big/S.png',
    T: 'assets/hekrilon/big/T.png',
    U: 'assets/hekrilon/big/U.png',
    V: 'assets/hekrilon/big/V.png',
    W: 'assets/hekrilon/big/W.png',
    X: 'assets/hekrilon/big/X.png',
    Y: 'assets/hekrilon/big/Y.png',
    Z: 'assets/hekrilon/big/Z.png',
    // Magyar kétjegyű mássalhangzók
    Cs: 'assets/hekrilon/big/Cs.png',
    Dz: 'assets/hekrilon/big/Dz.png',
    Dzs: 'assets/hekrilon/big/Dzs.png',
    Gy: 'assets/hekrilon/big/Gy.png',
    Ly: 'assets/hekrilon/big/Ly.png',
    Ny: 'assets/hekrilon/big/Ny.png',
    Sz: 'assets/hekrilon/big/Sz.png',
    Ty: 'assets/hekrilon/big/Ty.png',
    Zs: 'assets/hekrilon/big/Zs.png',
    // Magyar ékezetes nagybetűk
    Á: 'assets/hekrilon/big/Á.png',
    É: 'assets/hekrilon/big/É.png',
    Í: 'assets/hekrilon/big/Í.png',
    Ó: 'assets/hekrilon/big/Ó.png',
    Ö: 'assets/hekrilon/big/Ö.png',
    Ő: 'assets/hekrilon/big/Ő.png',
    Ú: 'assets/hekrilon/big/Ú.png',
    Ü: 'assets/hekrilon/big/Ü.png',
    Ű: 'assets/hekrilon/big/Ű.png'
  };

// A nagybetűs képfájlok kisbetűs párjai.
  private readonly lowercaseLetterImages: Record<string, string> = {
    a: 'assets/hekrilon/small/a.png',
    b: 'assets/hekrilon/small/b.png',
    c: 'assets/hekrilon/small/c.png',
    d: 'assets/hekrilon/small/d.png',
    e: 'assets/hekrilon/small/e.png',
    f: 'assets/hekrilon/small/f.png',
    g: 'assets/hekrilon/small/g.png',
    h: 'assets/hekrilon/small/h.png',
    i: 'assets/hekrilon/small/i.png',
    j: 'assets/hekrilon/small/j.png',
    k: 'assets/hekrilon/small/k.png',
    l: 'assets/hekrilon/small/l.png',
    m: 'assets/hekrilon/small/m.png',
    n: 'assets/hekrilon/small/n.png',
    o: 'assets/hekrilon/small/o.png',
    p: 'assets/hekrilon/small/p.png',
    q: 'assets/hekrilon/small/q.png',
    r: 'assets/hekrilon/small/r.png',
    s: 'assets/hekrilon/small/s.png',
    t: 'assets/hekrilon/small/t.png',
    u: 'assets/hekrilon/small/u.png',
    v: 'assets/hekrilon/small/v.png',
    w: 'assets/hekrilon/small/w.png',
    x: 'assets/hekrilon/small/x.png',
    y: 'assets/hekrilon/small/y.png',
    z: 'assets/hekrilon/small/z.png',
    // Magyar kétjegyű kis mássalhangzók:
    cs: 'assets/hekrilon/small/cs.png',
    dz: 'assets/hekrilon/small/dz.png',
    dzs: 'assets/hekrilon/small/dzs.png',
    gy: 'assets/hekrilon/small/gy.png',
    ly: 'assets/hekrilon/small/ly.png',
    ny: 'assets/hekrilon/small/ny.png',
    sz: 'assets/hekrilon/small/sz.png',
    ty: 'assets/hekrilon/small/ty.png',
    zs: 'assets/hekrilon/small/zs.png',
    // Magyar ékezetes kisbetűk:
    á: 'assets/hekrilon/small/á.png',
    é: 'assets/hekrilon/small/long_e.png',
    í: 'assets/hekrilon/small/long_i.png',
    ó: 'assets/hekrilon/small/long_o.png',
    ö: 'assets/hekrilon/small/short_her_o.png',
    ő: 'assets/hekrilon/small/long_her_o.png',
    ú: 'assets/hekrilon/small/long_u.png',
    ü: 'assets/hekrilon/small/short_points_u.png',
    ű: 'assets/hekrilon/small/long_points_u.png'
  };


  // Magyar hosszú és többjegyű mássalhangzók.
// Mindig a hosszabb alakokat keressük először!
  private readonly specialLetters: string[] = [
    // Hosszú, nagybetűs mássalhangzók
    'DDZS',
    'CCS',
    'DDZ',
    'GGY',
    'LLY',
    'NNY',
    'SSZ',
    'TTY',
    'ZZS',

    // Hosszú, kisbetűs mássalhangzók
    'ddzs',
    'ccs',
    'ddz',
    'ggy',
    'lly',
    'nny',
    'ssz',
    'tty',
    'zzs',

    // Háromjegyű mássalhangzó
    'Dzs',
    'dzs',

    // Kétjegyű mássalhangzók
    'Cs', 'Dz', 'Gy', 'Ly', 'Ny', 'Sz', 'Ty', 'Zs',
    'cs', 'dz', 'gy', 'ly', 'ny', 'sz', 'ty', 'zs'
  ];

  // Magyar mássalhangzók az egyszerű megkettőzéshez.
  private readonly consonants = new Set([
    //Nagybetűs változatok, ez dupla nagybetű lesz.
    'B', 'C', 'D', 'F', 'G', 'H', 'J',
    'K', 'L', 'M', 'N', 'P', 'Q', 'R',
    'S', 'T', 'V', 'W', 'X', 'Y', 'Z',

  ]);
  //Kisbetűs változatok, ez dupla kisbetű lesz.
  private readonly consonantsLowercase = new Set([
    'b', 'c', 'd', 'f', 'g', 'h', 'j',
    'k', 'l', 'm', 'n', 'p', 'q', 'r',
    's', 't', 'v', 'w', 'x', 'y', 'z'
  ]);

  // Gépeléskor automatikusan frissítjük a fordítást.
  onLatinInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;

    this.latinText = target.value;
    this.translateText();
  }


  private translateText(): void {
    const text = this.latinText;
    const glyphs: HekrilonGlyph[] = [];

    let index = 0;
    let glyphId = 0;

    while (index < text.length) {
      const character = text[index];

      // Szóközök, tabulátorok és sortörések megőrzése.
      if (/\s/.test(character)) {
        glyphs.push({
          id: glyphId++,
          character,
          type: 'space',
          imagePath: '',
          imageFailed: false
        });

        index++;
        continue;
      }

      // 1. Először a leghosszabb magyar betűkapcsolatot keressük.
      const specialLetter = this.specialLetters.find(letter =>
        text.startsWith(letter, index)
      );

      if (specialLetter) {
        let imagePath: string;

        // Hosszú, háromjegyű vagy kétjegyű mássalhangzók.
        if (['DDZS', 'CCS', 'DDZ', 'GGY', 'LLY',
          'NNY', 'SSZ', 'TTY', 'ZZS'].includes(specialLetter)) {
          imagePath = `assets/hekrilon/big-double/${specialLetter}.png`;
        } else if (['ddzs', 'ccs', 'ddz', 'ggy', 'lly',
          'nny', 'ssz', 'tty', 'zzs'].includes(specialLetter)) {
          imagePath = `assets/hekrilon/double/${specialLetter}.png`;
        } else if (specialLetter === 'Dzs' ||
          ['Cs', 'Dz', 'Gy', 'Ly', 'Ny', 'Sz', 'Ty', 'Zs'].includes(specialLetter)) {
          imagePath = `assets/hekrilon/big/${specialLetter}.png`;
        } else {
          // Kisbetűs cs, dzs, gy stb.
          imagePath = `assets/hekrilon/small/${specialLetter}.png`;
        }

        glyphs.push({
          id: glyphId++,
          character: specialLetter,
          type: 'letter',
          imagePath,
          imageFailed: false
        });

        index += specialLetter.length;
        continue;
      }

      // 2. Egyszerű, kétszer leírt nagybetűs mássalhangzó.
      const nextCharacter = text[index + 1];

      if (
        nextCharacter === character &&
        this.consonants.has(character)
      ) {
        const doubledLetter = character + nextCharacter;

        glyphs.push({
          id: glyphId++,
          character: doubledLetter,
          type: 'letter',
          imagePath: `assets/hekrilon/big-double/${doubledLetter}.png`,
          imageFailed: false
        });

        index += 2;
        continue;
      }

      // 3. Egyszerű, kétszer leírt kisbetűs mássalhangzó.
      if (
        nextCharacter === character &&
        this.consonantsLowercase.has(character)
      ) {
        const doubledLetter = character + nextCharacter;

        glyphs.push({
          id: glyphId++,
          character: doubledLetter,
          type: 'letter',
          imagePath: `assets/hekrilon/double/${doubledLetter}.png`,
          imageFailed: false
        });

        index += 2;
        continue;
      }

      // 4. Egyetlen latin betű: nagybetűhöz nagy,
      // kisbetűhöz kis Hekrilön-kép tartozik.
      const imagePath =
        character === character.toUpperCase()
          ? this.letterImages[character]
          : this.lowercaseLetterImages[character];

      if (imagePath) {
        glyphs.push({
          id: glyphId++,
          character,
          type: 'letter',
          imagePath,
          imageFailed: false
        });
      } else {
        // Írásjelek és egyelőre nem támogatott karakterek.
        glyphs.push({
          id: glyphId++,
          character,
          type: 'punctuation',
          imagePath: '',
          imageFailed: false
        });
      }

      index++;
    }

    this.translatedGlyphs = glyphs;
  }


  // Hiányzó képfájl esetén egy helykitöltőt mutatunk.
  onImageError(glyph: HekrilonGlyph): void {
    glyph.imageFailed = true;
  }

  // A szöveg és a fordítás törlése.
  clearText(): void {
    this.latinText = '';
    this.translatedGlyphs = [];
  }
}
