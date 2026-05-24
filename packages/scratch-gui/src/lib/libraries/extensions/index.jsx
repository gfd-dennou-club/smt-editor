import React from 'react';
import {FormattedMessage} from 'react-intl';

import kanirobo             from './smt/kanirobo.png';
import kaniroboInsetIconURL from './smt/kanirobo-small.png';

import kaniroboR             from './smt/kaniroboR.png';
import kaniroboRInsetIconURL from './smt/kaniroboR-small.png';

import mctboard             from './smt/mctboard.png';
import mctboardInsetIconURL from './smt/mctboard-small.png';

import rboard               from './smt/rboard.png'
import rboardInsetIconURL   from './smt/rboard-small.png';

import unifiedapi             from './smt/unifiedapi.png';
import unifiedapiInsetIconURL from './smt/unifiedapi-small.png';

import peripherals              from './smt/peripherals.png';
import peripheralsInsetIconURL  from './smt/peripherals-small.png';

// === Smalruby: Start of Ruby String extension ===
//import ruby from './smalruby-ruby/index.jsx';
// === Smalruby: End of Ruby String extension ===

export default [
    {
        name: (
            <FormattedMessage
                defaultMessage="Kanirobo"
                description="Name for the 'Kanirobo' extension"
                id="gui.kanirobo.name"
            />
        ),
        extensionId: 'kanirobo',
        iconURL: kanirobo,
        insetIconURL: kaniroboInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Kanirobo Blocks"
                description="Description for the 'Kanirobo' extension"
                id="gui.kanirobo.description"
            />
        ),
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="KaniroboR"
                description="Name for the 'KaniroboR' extension"
                id="gui.kaniroboR.name"
            />
        ),
        extensionId: 'kaniroboR',
        iconURL: kaniroboR,
        insetIconURL: kaniroboRInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="KaniroboR Blocks"
                description="Description for the 'KaniroboR' extension"
                id="gui.kaniroboR.description"
            />
        ),
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="MCT-Board"
                description="Name for the 'mctboard' extension"
                id="gui.mctboard.name"
            />
        ),
        extensionId: 'mctboard',
        iconURL: mctboard,
        insetIconURL: mctboardInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Matsue-ct Board Blocks"
                description="Description for the 'mctboard' extension"
                id="gui.mctboard.description"
            />
        ),
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="RBoard"
                description="Name for the 'RBoard' extension"
                id="gui.rboard.name"
            />
        ),
        extensionId: 'rboard',
        iconURL: rboard,
        insetIconURL: rboardInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="RBoard Blocks"
                description="Description for the 'RBoard' extension"
                id="gui.rboard.description"
            />
        ),
        featured: true,
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="UnifiedAPI"
                description="Name for the 'UnifiedAPI' extension"
                id="gui.unifiedapi.name"
            />
        ),
        extensionId: 'unifiedapi',
        iconURL: unifiedapi,
        insetIconURL: unifiedapiInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Unified I/O API Blocks"
                description="Description for the 'Unifiedapi' extension"
                id="gui.unifiedapi.description"
            />
        ),
        featured: true,
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Peripherals"
                description="Name for the 'Peripherals' extension"
                id="gui.peripherals.name"
            />
        ),
        extensionId: 'peripherals',
        iconURL: peripherals,
        insetIconURL: peripheralsInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Peripherals (sensors)"
                description="Description for the 'peripherals' extension"
                id="gui.peripherals.description"
            />
        ),
        featured: true
    },
    // === Smalruby: Start of Ruby String extension ===
//    ruby
    // === Smalruby: End of Ruby String extension ===
];
