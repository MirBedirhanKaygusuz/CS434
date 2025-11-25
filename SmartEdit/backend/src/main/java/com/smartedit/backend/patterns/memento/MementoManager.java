package com.smartedit.backend.patterns.memento;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class MementoManager {
    private Map<String, DocumentMemento> snapshots = new HashMap<>();

    public String saveSnapshot(DocumentMemento memento) {
        String id = UUID.randomUUID().toString();
        snapshots.put(id, memento);
        return id;
    }

    public DocumentMemento getSnapshot(String id) {
        return snapshots.get(id);
    }

    public List<SnapshotInfo> getAllSnapshots() {
        List<SnapshotInfo> list = new ArrayList<>();

        for (Map.Entry<String, DocumentMemento> entry : snapshots.entrySet()) {
            DocumentMemento m = entry.getValue();
            String preview = m.getContent().length() > 50 ? m.getContent().substring(0, 50) + "..." : m.getContent();

            list.add(new SnapshotInfo(entry.getKey(), m.getTimestamp(), m.getFileName(), preview));
        }

        list.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));
        return list;
    }
}
