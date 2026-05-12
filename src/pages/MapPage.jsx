import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import PageShell from '../components/PageShell.jsx';
import { resourceLocations, resourceTypes } from '../data/locations.js';
import { useLanguage } from '../providers/LanguageProvider.jsx';

const markerColors = {
  pads: '#F43F5E',
  clinics: '#7DD3FC',
  camps: '#86EFAC',
};

function createMarker(location) {
  return L.marker([location.lat, location.lng], {
    icon: L.divIcon({
      className: '',
      html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:${markerColors[location.type]};border:3px solid #FFF9F0;box-shadow:0 6px 16px rgba(59,47,47,.28)"></span>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    }),
  }).bindPopup(
    `<strong>${location.name}</strong><br/><span>${location.city}</span><br/><span style="text-transform:capitalize">${location.type}</span>`,
  );
}

export default function MapPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const mapNode = useRef(null);
  const map = useRef(null);
  const markers = useRef(null);

  const visibleLocations = useMemo(
    () => resourceLocations.filter((location) => filter === 'all' || location.type === filter),
    [filter],
  );

  useEffect(() => {
    if (!mapNode.current || map.current) return;

    map.current = L.map(mapNode.current, {
      scrollWheelZoom: false,
      zoomControl: false,
    }).setView([22.9734, 78.6569], 5);

    L.control.zoom({ position: 'bottomright' }).addTo(map.current);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map.current);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    if (markers.current) {
      markers.current.remove();
    }

    markers.current = L.layerGroup(visibleLocations.map(createMarker)).addTo(map.current);
    if (visibleLocations.length > 0) {
      const bounds = L.latLngBounds(visibleLocations.map((location) => [location.lat, location.lng]));
      map.current.fitBounds(bounds, { padding: [34, 34], maxZoom: 6 });
    }
  }, [visibleLocations]);

  return (
    <PageShell>
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-3xl font-black tracking-normal sm:text-4xl">{t('map.title')}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-shaktiText/72">{t('map.subtitle')}</p>
        </div>
        <p className="text-sm font-bold text-shaktiText/68">
          {visibleLocations.length} {t('map.count')}
        </p>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {resourceTypes.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilter(type)}
            className={[
              'shrink-0 rounded-full px-4 py-2 text-sm font-bold transition',
              filter === type
                ? 'bg-shaktiRose text-white shadow-sm'
                : 'border border-shaktiText/10 bg-white text-shaktiText hover:bg-shaktiCyan/35',
            ].join(' ')}
          >
            {t(`map.filters.${type}`)}
          </button>
        ))}
      </div>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="h-[32rem] overflow-hidden rounded-lg border border-shaktiText/10 bg-white shadow-soft">
          <div ref={mapNode} className="h-full w-full" aria-label="OpenStreetMap resource map" />
        </div>

        <div className="grid max-h-[32rem] gap-3 overflow-y-auto lg:block lg:space-y-3">
          {visibleLocations.map((location) => (
            <article key={location.id} className="rounded-lg border border-shaktiText/10 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span
                  className="mt-1 h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: markerColors[location.type] }}
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-base font-black tracking-normal">{location.name}</h2>
                  <p className="mt-1 text-sm text-shaktiText/68">{location.city}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-shaktiText/55">
                    {t(`map.filters.${location.type}`)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
