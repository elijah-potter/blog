# Quality Requires Visual Design

Earlier this week, I was looking through a table of user feedback about [Harper](https://writewithharper.com).
I believe that software should be build _with_ the user—not just _for_ the user—so this is a pretty regular ritual for me.

I was delighted.
Many of the usual complaints were totally absent from the report.
Users were encountering fewer of the make-or-break bugs that would harm their experience.
This meant that my recent push to get Harper prepared for a `1.0` release was working.
Great news! Yippee!

Unfortunately, something new emerged from beneath the pile of bugs: problems with Harper's visual design.

For quite some time now, I've been focused solely on the practical parts of Quality.
I mean bugs and the hard-to-deny usefulness of Harper's service.
In that time, I've forgotten that the visual appeal of the software is at least as important.
So, when I saw these complaints with Harper's visual design, I knew I needed to do something about it.

I've never claimed to be a designer, but I'm also not one to shy away from a challenge. 
So, I grabbed a copy of the [_Laws of UX_](https://app.thestorygraph.com/books/cd558dda-0b8d-48ff-9414-62684bc1c47b) (thanks [Eduardo](https://eduardo.blog/), for the recommendation) and got to work.

## Bring Everything Together

Here's the secret to Harper's design system: it hasn't really existed until now.
Each of the integrations, from the Chrome extension, to the website, and even the Obsidian plugin, had their own design system and appearance.
Mostly, this was because I didn't care enough about it when first crafting these projects.
Things have changed, so I'm going to take my time and do a good job in an attempt to service these user complaints.

Before I could start tweaking CSS styles, I needed a unified color scheme.
After some research and time in the color picker, I arrived at this:

<div style="
  --color-primary-50:#fef4e7;--color-primary-100:#fce9cf;--color-primary-200:#f9d49f;--color-primary-300:#f7be6e;--color-primary-400:#f4a83e;--color-primary:#f1920e;--color-primary-600:#c1750b;--color-primary-700:#915808;--color-primary-800:#603b06;--color-primary-900:#301d03;--color-primary-950:#221402;
  --color-accent-50:#fee7e9;--color-accent-100:#fccfd3;--color-accent-200:#f99fa6;--color-accent-300:#f76e7a;--color-accent-400:#f43e4d;--color-accent:#f10e21;--color-accent-600:#c10b1a;--color-accent-700:#910814;--color-accent-800:#60060d;--color-accent-900:#300307;--color-accent-950:#220205;
  --color-cream:#fef4e7;--color-cream-100:#fce9cf;--color-cream-200:#f9d49f;--color-cream-300:#f7be6e;--color-cream-400:#f4a83e;--color-cream-500:#f1920e;--color-cream-600:#c1750b;--color-cream-700:#915808;--color-cream-800:#603b06;--color-cream-900:#301d03;--color-cream-950:#221402;
  --color-white:#fffdfa;--color-white-100:#fceacf;--color-white-200:#fad59e;--color-white-300:#f7c06e;--color-white-400:#f5ab3d;--color-white-500:#f2960d;--color-white-600:#c2780a;--color-white-700:#915a08;--color-white-800:#613c05;--color-white-900:#301e03;--color-white-950:#221502;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  border:1px solid #00000014;border-radius:12px;padding:14px;background:var(--color-white);
">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
    <div style="width:12px;height:12px;border-radius:999px;background:var(--color-primary);"></div>
    <div style="font-weight:700;">Primary — honey bronze</div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(11,minmax(0,1fr));gap:6px;">
    <div style="background:var(--color-primary-50);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000b3;">50</div>
    <div style="background:var(--color-primary-100);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000b3;">100</div>
    <div style="background:var(--color-primary-200);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000b3;">200</div>
    <div style="background:var(--color-primary-300);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000b3;">300</div>
    <div style="background:var(--color-primary-400);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000b3;">400</div>
    <div style="background:var(--color-primary);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000cc;">500</div>
    <div style="background:var(--color-primary-600);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">600</div>
    <div style="background:var(--color-primary-700);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">700</div>
    <div style="background:var(--color-primary-800);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">800</div>
    <div style="background:var(--color-primary-900);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">900</div>
    <div style="background:var(--color-primary-950);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">950</div>
  </div>

  <hr style="border:none;border-top:1px solid #00000010;margin:14px 0;">

  <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
    <div style="width:12px;height:12px;border-radius:999px;background:var(--color-accent);"></div>
    <div style="font-weight:700;">Accent — hot fuchsia</div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(11,minmax(0,1fr));gap:6px;">
    <div style="background:var(--color-accent-50);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000b3;">50</div>
    <div style="background:var(--color-accent-100);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000b3;">100</div>
    <div style="background:var(--color-accent-200);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000b3;">200</div>
    <div style="background:var(--color-accent-300);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000b3;">300</div>
    <div style="background:var(--color-accent-400);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000b3;">400</div>
    <div style="background:var(--color-accent);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">500</div>
    <div style="background:var(--color-accent-600);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">600</div>
    <div style="background:var(--color-accent-700);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">700</div>
    <div style="background:var(--color-accent-800);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">800</div>
    <div style="background:var(--color-accent-900);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">900</div>
    <div style="background:var(--color-accent-950);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">950</div>
  </div>

  <hr style="border:none;border-top:1px solid #00000010;margin:14px 0;">

  <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
    <div style="width:12px;height:12px;border-radius:999px;background:var(--color-cream);"></div>
    <div style="font-weight:700;">Cream — simple cream</div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(11,minmax(0,1fr));gap:6px;">
    <div style="background:var(--color-cream);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000b3;">50</div>
    <div style="background:var(--color-cream-100);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000b3;">100</div>
    <div style="background:var(--color-cream-200);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000b3;">200</div>
    <div style="background:var(--color-cream-300);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000b3;">300</div>
    <div style="background:var(--color-cream-400);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000b3;">400</div>
    <div style="background:var(--color-cream-500);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000cc;">500</div>
    <div style="background:var(--color-cream-600);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">600</div>
    <div style="background:var(--color-cream-700);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">700</div>
    <div style="background:var(--color-cream-800);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">800</div>
    <div style="background:var(--color-cream-900);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">900</div>
    <div style="background:var(--color-cream-950);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">950</div>
  </div>

  <hr style="border:none;border-top:1px solid #00000010;margin:14px 0;">

  <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
    <div style="width:12px;height:12px;border-radius:999px;background:var(--color-white);border:1px solid #0000001a;"></div>
    <div style="font-weight:700;">White — warm white ramp</div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(11,minmax(0,1fr));gap:6px;">
    <div style="background:var(--color-white);height:48px;border-radius:8px;border:1px solid #00000012;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000b3;">base</div>
    <div style="background:var(--color-white-100);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000b3;">100</div>
    <div style="background:var(--color-white-200);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000b3;">200</div>
    <div style="background:var(--color-white-300);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000b3;">300</div>
    <div style="background:var(--color-white-400);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000b3;">400</div>
    <div style="background:var(--color-white-500);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#000000cc;">500</div>
    <div style="background:var(--color-white-600);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">600</div>
    <div style="background:var(--color-white-700);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">700</div>
    <div style="background:var(--color-white-800);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">800</div>
    <div style="background:var(--color-white-900);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">900</div>
    <div style="background:var(--color-white-950);height:48px;border-radius:8px;display:flex;align-items:end;justify-content:center;font-size:11px;padding:6px;color:#fff;">950</div>
  </div>

  <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;">
    <div style="flex:1;min-width:180px;border-radius:10px;padding:10px;background:linear-gradient(90deg,var(--color-primary-50),var(--color-primary));">
      <div style="font-size:12px;font-weight:700;color:#000000c0;">Primary gradient</div>
      <div style="font-size:11px;color:#000000a0;">50 → 500</div>
    </div>
    <div style="flex:1;min-width:180px;border-radius:10px;padding:10px;background:linear-gradient(90deg,var(--color-accent-50),var(--color-accent));">
      <div style="font-size:12px;font-weight:700;color:#000000c0;">Accent gradient</div>
      <div style="font-size:11px;color:#000000a0;">50 → 500</div>
    </div>
    <div style="flex:1;min-width:180px;border-radius:10px;padding:10px;background:linear-gradient(90deg,var(--color-cream),var(--color-cream-500));">
      <div style="font-size:12px;font-weight:700;color:#000000c0;">Cream gradient</div>
      <div style="font-size:11px;color:#000000a0;">50 → 500</div>
    </div>
    <div style="flex:1;min-width:180px;border-radius:10px;padding:10px;background:linear-gradient(90deg,var(--color-white),var(--color-white-500));border:1px solid #00000010;">
      <div style="font-size:12px;font-weight:700;color:#000000c0;">White gradient</div>
      <div style="font-size:11px;color:#000000a0;">base → 500</div>
    </div>
  </div>
</div>

From there, I built out a component library based on [Flowbite](https://flowbite.com/) and replaced all the relevant components in Harper's integrations with my own.

Next, I wanted to create a bit more dynamism with our typography.
After spending some time in Google Fonts, I decided to use Domine, a serif font for headings and Atkinson Hyperlegible for everything else.
Once I combined the duo with the orange-ish yellow from the color palette (which is usually associated with creative brands), I felt confident that I had nailed what I imagined Harper's personality to be.

## Finalizing the Draft

I feel that Harper's landing page embodies the design system well, so I've shown it below.
It's the first, and often only,  thing a user sees, so I put some extra care into it.
At the time of writing, [it is live](https://writewithharper.com).

### Before My Changes

![The Harper website before my changes](/images/writewithharper_before.png)

### After My Changes

![The Harper website after my changes](/images/writewithharper_after.png)


## Where Do I Go From Here?

As I said, this mini-project was simply a draft. 
I'll be working with Harper contributors on a more regular basis to continue nailing it down, slowly improving the Quality of the visual design for the entire project.
If you have any feedback, thoughts, or ideas for how we can make Harper more user-friendly or visually appealing, let me know!
