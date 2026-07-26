UPDATE "Team"
SET
  name = CASE slug
    WHEN 'olimpia' THEN '🦁 Leones'
    WHEN 'motagua' THEN '🦅 Aguilas'
    WHEN 'real-espana' THEN '🚂 Makina'
    WHEN 'marathon' THEN '🦕 Verdolagas'
    WHEN 'genesis' THEN '🐶 K9'
    WHEN 'juticalpa' THEN '🟢 Juti-Juti'
    WHEN 'olancho' THEN '🐎 Potros'
    WHEN 'platense' THEN '🦈 Tiburon'
    WHEN 'lobos-upnfm' THEN '🐺 Lobos'
    WHEN 'real-sociedad' THEN '🔴 Red Star'
    WHEN 'choloma' THEN '🧵 Maquileros'
    WHEN 'victoria' THEN '🐆 Panteras'
    ELSE name
  END,
  "shortName" = CASE slug
    WHEN 'olimpia' THEN 'Leones'
    WHEN 'motagua' THEN 'Aguilas'
    WHEN 'real-espana' THEN 'Makina'
    WHEN 'marathon' THEN 'Verdolagas'
    WHEN 'genesis' THEN 'K9'
    WHEN 'juticalpa' THEN 'Juti-Juti'
    WHEN 'olancho' THEN 'Potros'
    WHEN 'platense' THEN 'Tiburon'
    WHEN 'lobos-upnfm' THEN 'Lobos'
    WHEN 'real-sociedad' THEN 'Red Star'
    WHEN 'choloma' THEN 'Maquileros'
    WHEN 'victoria' THEN 'Panteras'
    ELSE "shortName"
  END
WHERE slug IN (
  'olimpia', 'motagua', 'real-espana', 'marathon', 'genesis', 'juticalpa',
  'olancho', 'platense', 'lobos-upnfm', 'real-sociedad', 'choloma', 'victoria'
);
