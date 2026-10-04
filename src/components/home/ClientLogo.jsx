import React from 'react';
import {
  IceCreamCone, Cake, Candy, Building2, TreePine,
  Crown, Wheat, Sun, Gem, Cookie,
} from 'lucide-react';

const ICONS = { IceCreamCone, Cake, Candy, Building2, TreePine, Crown, Wheat, Sun, Gem, Cookie };

/**
 * ClientLogo — one buyer brand in the logo wall.
 * Renders the supplied logo file when `client.logo` is set; otherwise a
 * generated lockup: a framed emblem plus a wordmark in the brand's own
 * typeface, with the buyer's sector underneath.
 */
export default function ClientLogo({ client }) {
  if (client.logo) {
    return (
      <div className="client-logo" title={client.nameFA}>
        <img src={client.logo} alt={client.nameFA} className="client-logo-img" loading="lazy" />
      </div>
    );
  }

  const Icon = ICONS[client.icon] || Building2;

  return (
    <div className="client-logo" title={client.nameFA}>
      <span className={`client-mark client-mark--${client.shape}`}>
        <Icon size={24} strokeWidth={1.5} />
      </span>
      <span className="client-logo-text">
        <span
          className="client-logo-name"
          style={{ fontFamily: `'${client.font}', serif`, fontWeight: client.weight }}
        >
          {client.nameFA}
        </span>
        <span className="client-logo-sector">{client.sectorFA}</span>
      </span>
    </div>
  );
}
