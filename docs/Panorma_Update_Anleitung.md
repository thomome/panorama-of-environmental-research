# Panorama Update Anleitung

> Das Panorama ist mit Javascript, HTML, CSS und JSON aufgebaut.

## Inhaltsanpassung
Anpassungen am Inhalt oder Tooltip sind schnell gemacht. Tooltip Texte können in der Datei [/data/shape.translation.json](/data/shape.translation.json) angepasst werden. Dazu kann ein beliebiger Texteditor verwendet werden. Die Objekte sind wie folgt aufgebaut:
- `id` => Eindeutige Id der Gruppe aus dem SVG
- `number` => Nummer aus dem Konzept
- `de` => Deutscher Text für Tooltip
- `fr` => Französischer Text für Tooltip
- `cat_de` => Deutscher Text für Tooltip Kategorie
- `cat_fr` => Französischer Text für Tooltip Kategorie
- `content` => Name der Datei im Ordner [/data/content/](/data/content/) ohne Sprache (de/fr) und `.html`

Inhaltstexte sind als HTML Datei gespeichert und können unter [/data/content/](/data/content/) auf Deutsch und Französisch bearbeitet werden.
Die verlinkten Bilder sind unter [/data/content/img/](/data/content/img/) abgelegt.

## Panorama Update
Wenn auf dem Panorama neue Elemente hinzugefügt, gelöscht oder geändert werden, sind die Anpassungen sehr aufwendig.

Zuerst müssen die neuen Elemente in der Datei [/data/panorama_umweltforschung.svg](/data/panorama_umweltforschung.svg) hinzugefügt werden. Dazu öffnet man die Datei mit z.B. Adobe Illustrator und macht man die nötigen visuellen Änderung.

Anschliessend müssen die Element diesen Vorgaben entsprechend gruppiert und betitelt werden (`outline` und `trigger` müssen extra erstellt werden):
- Gruppe für ganzes Element `item-[Nummer]-[eindeutige Bezeichnung]`
- Element/Gruppe für Hover und Klick Auslöser `trigger`
- Gruppe für schwarze Outline `outline`
- Gruppe für animierte Teile `anim`
- Gruppe für Nummer `numb`

![Beispiel Gruppierung](img/svg-groups.jpg)

Anschliessend sollte auch die Datei [/data/shape.translation.json](/data/shape.translation.json) auf nötige Änderungen überprüft werden, damit die Verknüpfung zwischen der Illustration und den Inhalten weiter funktioniert.
